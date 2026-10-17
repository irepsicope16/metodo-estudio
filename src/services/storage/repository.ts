import type { StorageDriver } from './driver'

interface BaseRow {
  id: string
  createdAt: string
  updatedAt: string
}

/** Repositorio genérico con contrato async, listo para migrar a un backend remoto. */
export class Repository<T extends BaseRow> {
  constructor(
    private readonly driver: StorageDriver,
    readonly collection: string,
  ) {}

  async list(): Promise<T[]> {
    return this.driver.read<T>(this.collection)
  }

  async get(id: string): Promise<T | undefined> {
    const rows = await this.list()
    return rows.find((r) => r.id === id)
  }

  async query(predicate: (row: T) => boolean): Promise<T[]> {
    const rows = await this.list()
    return rows.filter(predicate)
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<BaseRow>): Promise<T> {
    const now = new Date().toISOString()
    const row = {
      ...data,
      id: data.id ?? crypto.randomUUID(),
      createdAt: data.createdAt ?? now,
      updatedAt: now,
    } as T
    const rows = await this.list()
    rows.push(row)
    await this.driver.write(this.collection, rows)
    return row
  }

  async update(id: string, patch: Partial<T>): Promise<T> {
    const rows = await this.list()
    const idx = rows.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error(`[${this.collection}] no existe el registro ${id}`)
    const updated = { ...rows[idx], ...patch, id, updatedAt: new Date().toISOString() }
    rows[idx] = updated
    await this.driver.write(this.collection, rows)
    return updated
  }

  async remove(id: string): Promise<void> {
    const rows = await this.list()
    await this.driver.write(
      this.collection,
      rows.filter((r) => r.id !== id),
    )
  }

  async bulkCreate(items: T[]): Promise<void> {
    const rows = await this.list()
    await this.driver.write(this.collection, [...rows, ...items])
  }

  /** Reemplaza toda la colección (usado al importar una copia de seguridad). */
  async replaceAll(rows: T[]): Promise<void> {
    await this.driver.write(this.collection, rows)
  }
}

import { BaseApi } from '@/shared/infrastructure/base-api'
import type { AxiosResponse } from 'axios'
import { Prospect, type ProspectNote } from '../domain/prospect.entity'
import { TestDrive } from '../domain/test-drive.entity'

export interface CreateProspectCommand {
  fullName: string
  email: string
  phone: string
  interestedVehicleId?: string
  salesAgentId?: string
  monthlyIncome?: number
  downPayment?: number
  notes?: string
}

export interface ScheduleTestDriveCommand {
  vehicleId: string
  dealershipId: string
  scheduledDateTime: string
  notes?: string
}

/**
 * Infrastructure API Gateway for CRM Prospects & Test Drives (API Section 11).
 */
export class CrmApi extends BaseApi {
  /**
   * 11.1 Create CRM Prospect.
   * POST /api/v1/dealers/me/prospects
   */
  public async createProspect(command: CreateProspectCommand): Promise<Prospect> {
    const response: AxiosResponse<any> = await this.http.post('/api/v1/dealers/me/prospects', command)
    const p = response.data
    return new Prospect(
      p.id,
      p.dealershipId || null,
      p.fullName,
      p.email,
      p.phone,
      p.interestedVehicleId || null,
      p.salesAgentId || null,
      p.status || 'CONTACTED',
      p.monthlyIncome || 0,
      p.downPayment || 0,
      p.notes || null,
      p.createdAt,
      p.updatedAt,
      p.vehicleName
    )
  }

  /**
   * 11.2 List Dealership Prospects.
   * GET /api/v1/dealers/me/prospects
   */
  public async getDealerProspects(): Promise<Prospect[]> {
    const response: AxiosResponse<any> = await this.http.get('/api/v1/dealers/me/prospects')
    const list = Array.isArray(response.data) ? response.data : (response.data?.content || [])
    return list.map((p: any) => new Prospect(
      p.id,
      p.dealershipId || null,
      p.fullName,
      p.email,
      p.phone,
      p.interestedVehicleId || null,
      p.salesAgentId || null,
      p.status || 'CONTACTED',
      Number(p.monthlyIncome) || 0,
      Number(p.downPayment) || 0,
      p.notes || null,
      p.createdAt,
      p.updatedAt,
      p.vehicleName
    ))
  }

  /**
   * 11.3 Get Prospect by ID.
   * GET /api/v1/dealers/me/prospects/{id}
   */
  public async getDealerProspectById(id: string): Promise<Prospect> {
    const response: AxiosResponse<any> = await this.http.get(`/api/v1/dealers/me/prospects/${id}`)
    const p = response.data
    return new Prospect(
      p.id,
      p.dealershipId || null,
      p.fullName,
      p.email,
      p.phone,
      p.interestedVehicleId || null,
      p.salesAgentId || null,
      p.status || 'CONTACTED',
      Number(p.monthlyIncome) || 0,
      Number(p.downPayment) || 0,
      p.notes || null,
      p.createdAt,
      p.updatedAt,
      p.vehicleName
    )
  }

  /**
   * 11.4 Add Note to Prospect Timeline.
   * POST /api/v1/prospects/{id}/notes
   */
  public async addProspectNote(prospectId: string, content: string): Promise<ProspectNote> {
    const response: AxiosResponse<any> = await this.http.post(`/api/v1/prospects/${prospectId}/notes`, { content })
    return {
      id: response.data.id || String(Date.now()),
      prospectId,
      authorName: response.data.authorName || 'Asesor Comercial',
      content: response.data.content || content,
      createdAt: response.data.createdAt || new Date().toISOString()
    }
  }

  /**
   * 11.5 Get Prospect Timeline Notes.
   * GET /api/v1/prospects/{id}/timeline
   */
  public async getProspectTimeline(prospectId: string): Promise<ProspectNote[]> {
    const response: AxiosResponse<any> = await this.http.get(`/api/v1/prospects/${prospectId}/timeline`)
    const list = Array.isArray(response.data) ? response.data : []
    return list.map((item: any) => ({
      id: item.id || String(Date.now()),
      prospectId,
      authorName: item.authorName || 'Asesor Comercial',
      content: item.content || item.note || '',
      createdAt: item.createdAt || new Date().toISOString()
    }))
  }

  /**
   * 11.6 Update Prospect Status.
   * PATCH /api/v1/prospects/{id}/status
   */
  public async updateProspectStatus(prospectId: string, status: string): Promise<Prospect> {
    const response: AxiosResponse<any> = await this.http.patch(`/api/v1/prospects/${prospectId}/status`, { status })
    const p = response.data
    return new Prospect(
      p.id,
      p.dealershipId || null,
      p.fullName,
      p.email,
      p.phone,
      p.interestedVehicleId || null,
      p.salesAgentId || null,
      p.status || status,
      Number(p.monthlyIncome) || 0,
      Number(p.downPayment) || 0,
      p.notes || null,
      p.createdAt,
      p.updatedAt,
      p.vehicleName
    )
  }

  /**
   * 11.7 Schedule Test Drive.
   * POST /api/v1/test-drives
   */
  public async scheduleTestDrive(command: ScheduleTestDriveCommand): Promise<TestDrive> {
    const response: AxiosResponse<any> = await this.http.post('/api/v1/test-drives', command)
    const t = response.data
    return new TestDrive(
      t.id,
      t.userId,
      t.dealershipId,
      t.vehicleId,
      t.scheduledDateTime,
      t.status || 'SCHEDULED',
      t.notes || null,
      t.createdAt,
      t.vehicleTitle,
      t.dealershipName
    )
  }

  /**
   * 11.8 List My Test Drives.
   * GET /api/v1/test-drives/me
   */
  public async getMyTestDrives(): Promise<TestDrive[]> {
    const response: AxiosResponse<any> = await this.http.get('/api/v1/test-drives/me')
    const list = Array.isArray(response.data) ? response.data : []
    return list.map((t: any) => new TestDrive(
      t.id,
      t.userId,
      t.dealershipId,
      t.vehicleId,
      t.scheduledDateTime,
      t.status || 'SCHEDULED',
      t.notes || null,
      t.createdAt,
      t.vehicleTitle,
      t.dealershipName
    ))
  }

  /**
   * 11.9 Get Test Drive by ID.
   * GET /api/v1/test-drives/{id}
   */
  public async getTestDriveById(id: string): Promise<TestDrive> {
    const response: AxiosResponse<any> = await this.http.get(`/api/v1/test-drives/${id}`)
    const t = response.data
    return new TestDrive(
      t.id,
      t.userId,
      t.dealershipId,
      t.vehicleId,
      t.scheduledDateTime,
      t.status || 'SCHEDULED',
      t.notes || null,
      t.createdAt,
      t.vehicleTitle,
      t.dealershipName
    )
  }

  /**
   * 11.10 Update Test Drive Status.
   * PATCH /api/v1/test-drives/{id}/status
   */
  public async updateTestDriveStatus(id: string, status: string): Promise<TestDrive> {
    const response: AxiosResponse<any> = await this.http.patch(`/api/v1/test-drives/${id}/status`, { status })
    const t = response.data
    return new TestDrive(
      t.id,
      t.userId,
      t.dealershipId,
      t.vehicleId,
      t.scheduledDateTime,
      t.status || status,
      t.notes || null,
      t.createdAt,
      t.vehicleTitle,
      t.dealershipName
    )
  }

  /**
   * 11.11 Cancel Test Drive.
   * DELETE /api/v1/test-drives/{id}
   */
  public async cancelTestDrive(id: string): Promise<void> {
    await this.http.delete(`/api/v1/test-drives/${id}`)
  }
}

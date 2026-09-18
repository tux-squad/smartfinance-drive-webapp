/**
 * Domain Command representing the request to upload an image for a specific Vehicle.
 */
export class UploadVehicleImageCommand {
  constructor(
    public readonly vehicleId: string,
    public readonly file: File
  ) {}
}

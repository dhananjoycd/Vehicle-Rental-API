export interface VehiclePayLoad {
  vehicle_name: string;
  type: "car" | "bike" | "van" | "SUV" | string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: "available" | string;
}

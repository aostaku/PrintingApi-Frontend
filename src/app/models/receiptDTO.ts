export interface Receipt {
  id?: string;
  company?: string;
  streetAddress?: string;
  cityZipCode: string;
  website: string;
  dateTime: Date;
  productName: string;
  price: number;
}

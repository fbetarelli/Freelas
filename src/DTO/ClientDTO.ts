export class ClientDTO {
  id: string;
  name: string;
  address: string;
  contact: string;

  constructor({ id, name, address, contact }: ClientDTO) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.contact = contact;
  }
}

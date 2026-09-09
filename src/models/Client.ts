export interface ClientType {
  id: string;
  name: string;
  address: string;
  contact: string;
  userId: string;
  // dateModified: string;
}

export class Client implements ClientType {
  id;
  name;
  address;
  contact;
  userId;
  // dateModified;

  constructor({ id, name, address, contact, userId }: ClientType) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.contact = contact;
    // this.dateModified = dateModified;
    this.userId = userId;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getAddress() {
    return this.address;
  }

  getContact() {
    return this.contact;
  }

  getUserId() {
    return this.userId;
  }
  // getDateModified() {
  //   return this.dateModified;
  // }

  //   toJSON() {
  //     return {
  //       id: this.id,
  //       name: this.name,
  //       contact: this.contact,
  //       address: this.address,
  //       userId: this.userId,
  //     };
  //   }
}

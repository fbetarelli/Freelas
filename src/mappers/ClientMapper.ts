import { ClientDTO } from  "../DTO/ClientDTO.ts";
import { Client } from  "../models/Client.ts";

export function toDTO(obj: Client): ClientDTO {
  let dto = new ClientDTO({
    id: obj.getId(),
    name: obj.getName(),
    address: obj.getAddress(),
    contact: obj.getContact(),
  });
  return dto;
}

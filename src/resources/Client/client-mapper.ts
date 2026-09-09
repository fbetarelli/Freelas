import { ClientDTO } from "./client-DTO.ts";
import { Client } from "./types.ts";

export function toDTO(obj: Client): ClientDTO {
  let dto = new ClientDTO({
    id: obj.getId(),
    name: obj.getName(),
    address: obj.getAddress(),
    contact: obj.getContact(),
  });
  return dto;
}

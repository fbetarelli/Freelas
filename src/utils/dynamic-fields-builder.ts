export const dynamicFieldsBuilder = <T extends Record<string, unknown>>(
  object: T,
) => {
  const fields: string[] = [];
  const values: Array<T[keyof T]> = [];
  let index = 1;

  //Object entries: separa objeto em dois atributos: chave e valor;
  for (const key of Object.keys(object) as Array<keyof T>) {
    const value = object[key];

    if (value !== undefined && value !== null) {
      //cria fields dinamicamente, EX: key=name, index=1, field gerado: name = $1;
      fields.push(`${String(key)} = $${index++}`);
      values.push(value);
    }
  }

  return { fields, values };
};

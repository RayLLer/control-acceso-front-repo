export const convertForSelect = (entities: any[], attr?: string) => {
  return entities.map((entity) => ({
    label: entity.attributes[attr ?? 'name'],
    value: entity.id,
  }));
};

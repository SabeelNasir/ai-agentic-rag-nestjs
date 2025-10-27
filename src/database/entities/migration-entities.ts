import Entities from "src/database/entities/db";

const excludeEntities = ["Vector"];
const migrationEntities = Object.values(Entities).filter((entity) => !excludeEntities.includes(entity.name));

export default migrationEntities;

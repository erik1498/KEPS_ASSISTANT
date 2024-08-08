import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import { getEnv } from "./envUtils.js";

export const generateDatabaseName = (req_identity, logger) => {
    // return logger ? `${getEnv("DB_NAME")}_logging_${JSON.parse(req_identity).client_id}` : `${getEnv("DB_NAME")}_${JSON.parse(req_identity).client_id}`
    return `${getEnv("DB_NAME")}_alor`
}

export const selectOneQueryUtil = async (db_name, model, attributes, whereCondition) => {
    const selectQuery = db.getQueryInterface().queryGenerator.selectQuery(`${db_name}.${model.getTableName()}`, {
        attributes,
        where: whereCondition,
        limit: 1
    });
    const data = await db.query(
        selectQuery.replaceAll("`", ""),
        { type: Sequelize.QueryTypes.SELECT }
    )
    return data.length > 0 ? data[0] : null
}

export const selectAllQueryUtil = async (db_name, model, attributes, whereCondition) => {
    const selectQuery = db.getQueryInterface().queryGenerator.selectQuery(`${db_name}.${model.getTableName()}`, {
        attributes,
        where: whereCondition
    });
    const data = await db.query(
        selectQuery.replaceAll("`", ""),
        { type: Sequelize.QueryTypes.SELECT }
    )
    return data
}

export const insertQueryUtil = async (db_name, model, data) => {
    data.createdAt = new Date();
    data.updatedAt = new Date();
    const insertQuery = db.getQueryInterface().queryGenerator.insertQuery(`${db_name}.${model.getTableName()}`, model.build(data).get());

    const [id, _] = await db.query(
        insertQuery.query.replaceAll("`", ""),
        {
            bind: insertQuery.bind,
            type: Sequelize.QueryTypes.INSERT,
            returning: true
        },
    )
    return selectOneQueryUtil(db_name, model, null, {
        id
    });
}

export const updateQueryUtil = async (db_name, model, data, whereCondition) => {
    data.updatedAt = new Date();
    const updateQuery = db.getQueryInterface().queryGenerator.updateQuery(`${db_name}.${model.getTableName()}`, data, whereCondition);

    return await db.query(
        updateQuery.query.replaceAll("`", "")
        ,
        {
            bind: updateQuery.bind,
            type: Sequelize.QueryTypes.UPDATE
        }
    );
}
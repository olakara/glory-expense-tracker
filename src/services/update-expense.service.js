const express = require('express');
const debug = require('debug')('app:expense-tracker:query-service');
const { MongoClient } = require('mongodb');

async function updateExpenseById(expenseDto) {

    const url = 'mongodb://localhost:27017';
    const dbName = 'expense-tracker';

    let client;
    try {
        client = await MongoClient.connect(url);
        debug('Connected to the Mongo DB');
        const db = client.db(dbName);

        await db.collection('expenses').updateOne({ "_id": ObjectId(expenseDto.id) },
            {
                $set: {
                    "title": expenseDto.title,
                    "amount": expenseDto.amount,
                    "date": expenseDto.date,
                    "updatedBy": "SYSTEM",
                }
            });
        return response;

    } catch (error) {
        debug(error.stack);
    }
    client.close();
}

async function approveExpense(id) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'expense-tracker';

    let client;
    try {
        client = await MongoClient.connect(url);
        debug('Connected to the Mongo DB');
        const db = client.db(dbName);

        await db.collection('expenses').updateOne({ "_id": ObjectId(id) },
            {
                $set: {
                    "isApproved": true,
                    "approvedBy": "SYSTEM"
                }
            });

    } catch (error) {
        debug(error.stack);
    }
    client.close();

}

async function rejectExpense(id) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'expense-tracker';

    let client;
    try {
        client = await MongoClient.connect(url);
        debug('Connected to the Mongo DB');
        const db = client.db(dbName);

        await db.collection('expenses').updateOne({ "_id": ObjectId(id) },
            { $set: { "isDeleted": true } });

    } catch (error) {
        debug(error.stack);
    }
    client.close();

}


module.exports = { updateExpenseById, approveExpense, rejectExpense };
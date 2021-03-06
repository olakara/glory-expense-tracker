const express = require('express');
const router = express.Router();
const debug = require('debug')('app:expense-tracker:router');
const queryService = require('../services/query-expense.service');
const createService = require('../services/create-expense.service');
const updateService = require('../services/update-expense.service');
const deleteService = require('../services/delete-expense.service');
const validator = require('../validators/expense-validator');
const { validationResult } = require('express-validator');

router.get('/', async (req, res) => {

    const vm = await queryService.getAllExpenses()
    res.json(vm);
});

router.get('/:id', async (req, res) => {

    const id = req.params.id;
    const vm = await queryService.getExpenseById(id)
    res.json(vm);
});

// Create new expense report
router.post('/', validator.createExpense, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const expenseDto = {
        title: req.body.title,
        amount: req.body.amount,
        date: req.body.date
    };

    res.json(await createService.createExpense(expenseDto));
});

// Update  expense report
router.put('/:id', validator.updateExpense, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const expenseDto = {
        id: req.body.id,
        title: req.body.title,
        amount: req.body.amount,
        date: req.body.date
    };

    res.json(await updateService.updateExpenseById(expenseDto));

});

// Approve expense report
router.put('/:id/approve', async (req, res) => {
    const id = req.params.id;
    res.json(await updateService.approveExpense(id));
});

// Reject expense report
router.put('/:id/reject', async (req, res) => {
    const id = req.params.id;
    res.json(await updateService.rejectExpense(id));
});

// Delete expense report
router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;
        res.json(await deleteService.deleteExpenseById(id));

    } catch (error) {

        debug(error);
        res.status(406).json(error)
    }
});

module.exports = router;
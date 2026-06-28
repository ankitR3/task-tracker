import Task from '../../models/task.model.js';

export default async function createTaskController(req, res, next) {
    try {
        console.log('createTask req.body:', JSON.stringify(req.body));
        const { title, description, status, priority, dueDate, listId, section } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Title is required',
            });
        }

        if (title.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Title must be at least 3 characters',
            });
        }

        if (dueDate) {
            const targetDate = new Date(dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (targetDate < today) {
                return res.status(400).json({
                    success: false,
                    message: 'Due date cannot be in the past',
                });
            }
        }

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || '',
            status: status,
            priority: priority,
            dueDate: dueDate || null,
            listId: listId || null,
            section: section || 'Not Sectioned',
        })

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (err) {
        console.log('error while creating: ', err);
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}
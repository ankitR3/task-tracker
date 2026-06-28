import Task from '../../models/task.model.js'

export default async function updateTaskController(req, res) {
  try {
    const { title, description, priority, dueDate, status, section } = req.body;

    if (title && title.trim().length < 3) {
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

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate }),
        ...(status && { status }),
        ...(section !== undefined && { section }),
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
        success: true,
        data: task
    });
  } catch (err) {
    console.log('error while updating the task: ', err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  }
}
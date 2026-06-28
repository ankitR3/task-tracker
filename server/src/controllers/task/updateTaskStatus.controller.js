import Task from '../../models/task.model.js'

export default async function updateTaskStatusController(req, res) {
  try {
    const { status } = req.body

    const validStatuses = ['pending', 'in-progress', 'completed']
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be pending, in-progress or completed',
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status
      },
      {
        new: true
      }
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
    console.log('error while updating the task status: ', err);
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
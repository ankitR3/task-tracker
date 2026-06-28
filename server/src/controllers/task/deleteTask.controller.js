import Task from '../../models/task.model.js'

export default async function deleteTaskController(req, res) {
  try {
    const existingTask = await Task.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (existingTask.isDeleted) {
      // Permanent delete
      await Task.findByIdAndDelete(req.params.id);
      return res.json({
        success: true,
        message: 'Task permanently deleted',
      });
    } else {
      // Soft delete (move to trash)
      existingTask.isDeleted = true;
      await existingTask.save();
      return res.json({
        success: true,
        message: 'Task moved to trash',
        data: existingTask,
      });
    }
  } catch (err) {
    console.log('error while deleting: ', err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}
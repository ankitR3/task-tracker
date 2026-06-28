import Task from '../../models/task.model.js'

export default async function getAllTasksController(req, res) {
  try {
    const { status, priority, sort, search, listId, isDeleted } = req.query

    let filter = {};
    if (isDeleted === 'true') {
        filter.isDeleted = true;
    } else {
        filter.isDeleted = { $ne: true };
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (listId) filter.listId = listId;
    if (search) {
        filter.title = {
            $regex: search,
            $options: 'i'
        }
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 }
    if (sort === 'priority') sortOption = { priority: 1 }
    if (sort === 'title') sortOption = { title: 1 }
    if (sort === 'oldest') sortOption = { createdAt: 1 }

    const tasks = await Task.find(filter).sort(sortOption)
    console.log("getAllTasksController filter:", JSON.stringify(filter), "tasks found:", tasks.length);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    console.log('error while getting all the task: ', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}
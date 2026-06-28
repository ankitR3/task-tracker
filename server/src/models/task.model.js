import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    listId: {
      type: String,
      default: null,
    },
    section: {
      type: String,
      default: 'Not Sectioned',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Task', taskSchema)
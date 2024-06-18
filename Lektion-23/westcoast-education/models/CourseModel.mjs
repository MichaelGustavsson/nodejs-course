import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseNumber: {
    type: Number,
    unique: true,
    required: [true, 'Ett kursnummer måste anges'],
  },
  title: {
    type: String,
    required: [true, 'Ange kursens namn'],
    unique: true,
    trim: true,
    maxlength: [100, 'Maximalt antal tecken för en kurs är 100 tecken'],
  },
  description: {
    type: String,
    required: [true, 'Var vänlig och ge kursen en kort beskrivning'],
  },
  days: {
    type: Number,
    required: [true, 'Antal kursdagar måste anges'],
  },
  tuition: {
    type: Number,
    required: [true, 'Pris för kursen måste anges'],
  },
  level: {
    type: String,
    enum: ['Nybörjare', 'Medel', 'Avancerad'],
    default: 'Nybörjare',
  },
  category: {
    type: [String],
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Agile & Scrum',
      'Blockchain',
      'Cloud Development',
    ],
  },
  inClass: {
    type: Boolean,
    default: true,
  },
  remote: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Course', courseSchema);

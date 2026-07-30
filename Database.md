# CourtFlow — Database Design

## Entities

### User
```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  email: String (required, unique),
  phone: String,
  password: String (hashed, required),
  role: Enum ['super_admin', 'club_owner', 'staff', 'player'],
  avatar: String (Cloudinary URL),
  ownedClubs: [ref: Club],
  staffClubs: [ref: Club],
  savedClubs: [ref: Club],
  preferences: {
    notifications: { email: Boolean, inApp: Boolean },
    theme: Enum ['light', 'dark', 'system']
  },
  emailVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  refreshTokens: [String],
  lastActiveAt: Date,
  status: Enum ['active', 'suspended'],
  deletedAt: Date (soft delete),
  createdAt: Date,
  updatedAt: Date
}
```

### Club
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    coordinates: { lat: Number, lng: Number }
  },
  phone: String,
  email: String,
  logo: String (Cloudinary URL),
  coverImage: String (Cloudinary URL),
  operatingHours: [{
    day: Enum ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    open: String (HH:mm),
    close: String (HH:mm),
    isClosed: Boolean
  }],
  owner: ref: User (required),
  settings: {
    defaultBookingDuration: Number (minutes, default: 60),
    maxAdvanceDays: Number (default: 30),
    cancellationPolicy: Enum ['flexible', 'moderate', 'strict'],
    cancellationDeadline: Number (hours before),
    allowGuestBookings: Boolean (default: false)
  },
  status: Enum ['active', 'inactive'],
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Court
```javascript
{
  _id: ObjectId,
  club: ref: Club (required),
  name: String (required),
  description: String,
  surface: Enum ['indoor', 'outdoor'],
  hourlyRate: Number (required),
  currency: String (default: 'PHP'),
  image: String (Cloudinary URL),
  features: [Enum ['lights', 'covered', 'academy', 'tournament_grade']],
  capacity: Number (default: 4, for doubles),
  status: Enum ['available', 'maintenance', 'closed'],
  maintenanceSchedule: [{
    startDate: Date,
    endDate: Date,
    reason: String
  }],
  sortOrder: Number (for display ordering),
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking
```javascript
{
  _id: ObjectId,
  club: ref: Club (required),
  court: ref: Court (required),
  player: ref: User (required),
  date: Date (required),
  startTime: Date (required),
  endTime: Date (required),
  duration: Number (minutes, required),
  totalAmount: Number (required),
  status: Enum [
    'pending', 'confirmed', 'in-progress',
    'completed', 'cancelled', 'no-show'
  ],
  cancellation: {
    reason: String,
    cancelledBy: ref: User,
    cancelledAt: Date
  },
  rescheduledFrom: ref: Booking,
  rescheduledTo: ref: Booking,
  notes: String,
  paymentStatus: Enum ['unpaid', 'paid', 'refunded', 'partially_refunded'],
  payment: ref: Payment,
  checkedInAt: Date,
  checkedOutAt: Date,
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment
```javascript
{
  _id: ObjectId,
  booking: ref: Booking (required),
  player: ref: User (required),
  amount: Number (required),
  currency: String (default: 'PHP'),
  method: Enum ['gcash', 'maya', 'stripe', 'cash', 'bank_transfer'],
  transactionId: String,
  status: Enum ['pending', 'completed', 'failed', 'refunded'],
  receiptUrl: String,
  metadata: Object,
  paidAt: Date,
  refundedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification
```javascript
{
  _id: ObjectId,
  recipient: ref: User (required),
  club: ref: Club,
  type: Enum [
    'booking_confirmed', 'booking_cancelled',
    'booking_reminder', 'booking_rescheduled',
    'payment_received', 'payment_failed',
    'court_maintenance', 'club_update',
    'system'
  ],
  title: String (required),
  message: String (required),
  data: Object,
  read: Boolean (default: false),
  readAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

```javascript
// Users
userSchema.index({ email: 1 }, { unique: true, sparse: true })
userSchema.index({ role: 1, status: 1 })

// Clubs
clubSchema.index({ owner: 1 })
clubSchema.index({ status: 1, name: 1 })

// Courts
courtSchema.index({ club: 1, status: 1 })
courtSchema.index({ club: 1, surface: 1 })

// Bookings (critical for performance)
bookingSchema.index({ court: 1, date: 1, startTime: 1, endTime: 1 })
bookingSchema.index({ player: 1, status: 1, date: -1 })
bookingSchema.index({ club: 1, date: 1, status: 1 })
bookingSchema.index({ status: 1, date: 1 }) // for dashboard aggregates

// Notifications
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })

// Payments
paymentSchema.index({ booking: 1 })
paymentSchema.index({ player: 1, status: 1 })
```

## Soft Delete Pattern

All major entities use soft delete:
```javascript
deletedAt: { type: Date, default: null }

// In queries:
Model.find({ deletedAt: null })
```

## Timestamps

All entities have automatic `createdAt` and `updatedAt` via Mongoose `{ timestamps: true }`.


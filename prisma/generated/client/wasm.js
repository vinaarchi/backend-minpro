
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.1.0
 * Query Engine version: 11f085a2012c0f4778414c8db2651556ee0ef959
 */
Prisma.prismaVersion = {
  client: "6.1.0",
  engine: "11f085a2012c0f4778414c8db2651556ee0ef959"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  fullname: 'fullname',
  email: 'email',
  password: 'password',
  phone: 'phone',
  gender: 'gender',
  imgProfile: 'imgProfile',
  isVerified: 'isVerified',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  referralCode: 'referralCode',
  referredById: 'referredById'
};

exports.Prisma.EventScalarFieldEnum = {
  event_id: 'event_id',
  name: 'name',
  description: 'description',
  date: 'date',
  time: 'time',
  location: 'location',
  organiserId: 'organiserId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  categoryId: 'categoryId',
  locationDetailId: 'locationDetailId',
  heldBy: 'heldBy',
  image: 'image'
};

exports.Prisma.EventCategoryScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  format: 'format',
  topic: 'topic'
};

exports.Prisma.LocationDetailScalarFieldEnum = {
  id: 'id',
  province: 'province',
  city: 'city',
  district: 'district',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  userId: 'userId',
  rating: 'rating',
  comment: 'comment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TicketScalarFieldEnum = {
  ticket_id: 'ticket_id',
  eventId: 'eventId',
  price: 'price',
  available: 'available',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  contactEmail: 'contactEmail',
  contactName: 'contactName',
  contactNumber: 'contactNumber',
  description: 'description',
  expiredDate: 'expiredDate',
  type: 'type',
  startDate: 'startDate',
  ticketName: 'ticketName'
};

exports.Prisma.PromotionScalarFieldEnum = {
  promotion_id: 'promotion_id',
  eventId: 'eventId',
  type: 'type',
  value: 'value',
  promotionCode: 'promotionCode',
  startDate: 'startDate',
  expirationDate: 'expirationDate',
  maxUse: 'maxUse',
  useCount: 'useCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PointBalanceScalarFieldEnum = {
  id: 'id',
  points: 'points',
  expirationDate: 'expirationDate',
  userId: 'userId',
  createdAt: 'createdAt',
  updateAt: 'updateAt'
};

exports.Prisma.DiscountCouponScalarFieldEnum = {
  id: 'id',
  code: 'code',
  discount: 'discount',
  userId: 'userId',
  createdAt: 'createdAt',
  updateAt: 'updateAt',
  expirationDate: 'expirationDate'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  ticketId: 'ticketId',
  userId: 'userId',
  proofImage: 'proofImage',
  status: 'status',
  finalPrice: 'finalPrice',
  promotionCode: 'promotionCode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  CUSTOMER: 'CUSTOMER',
  ORGANIZER: 'ORGANIZER'
};

exports.PromotionType = exports.$Enums.PromotionType = {
  PERCENTAGE: 'PERCENTAGE',
  FLAT: 'FLAT'
};

exports.Prisma.ModelName = {
  User: 'User',
  Event: 'Event',
  EventCategory: 'EventCategory',
  LocationDetail: 'LocationDetail',
  Review: 'Review',
  Ticket: 'Ticket',
  Promotion: 'Promotion',
  PointBalance: 'PointBalance',
  DiscountCoupon: 'DiscountCoupon',
  Transaction: 'Transaction'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

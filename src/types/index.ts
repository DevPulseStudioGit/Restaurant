export type OrderType = 'delivery' | 'pickup';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'ready_for_pickup'
  | 'completed'
  | 'cancelled';

export type PaymentMethod =
  | 'cod' // Cash on Delivery
  | 'card_on_delivery' // Card on Delivery
  | 'bank_transfer_raast' // Raast / Direct Bank Transfer
  | 'card_online'; // Card Online (Simulated Gateway)

export type DietaryTag = 'halal' | 'vegetarian' | 'chef-special' | 'bestseller' | 'spicy';

export interface OptionChoice {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  required: boolean;
  minSelect: number;
  maxSelect: number;
  choices: OptionChoice[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  description: string;
  price: number;
  image: string;
  spiceLevel?: 0 | 1 | 2 | 3; // 0: None, 1: Mild, 2: Medium, 3: Fiery
  dietary: DietaryTag[];
  isAvailable: boolean;
  branchIds?: string[]; // If restricted, else available in all branches
  optionGroups?: ProductOptionGroup[];
  preparationTimeMinutes?: number;
  portionSize?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  active: boolean;
}

export interface Deal {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  includedItemsSummary: string[];
  optionGroups?: ProductOptionGroup[];
  isAvailable: boolean;
  branchIds?: string[];
  badge?: string;
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  area: string;
  city: string;
  phone: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  supportedOrderTypes: OrderType[];
  deliveryZones: string[]; // Names of delivery areas this branch covers
  deliveryFee: number;
  minOrder: number;
  active: boolean;
  estDeliveryTimeMinutes: string;
  estPickupTimeMinutes: string;
}

export interface DeliveryArea {
  id: string;
  name: string;
  city: string;
  assignedBranchId: string;
  deliveryFee: number;
  minOrder: number;
  estMinutes: string;
  active: boolean;
}

export interface CartSelectedOption {
  groupId: string;
  groupName: string;
  choiceId: string;
  choiceName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // Unique ID per item configuration in cart
  productId: string;
  isDeal?: boolean;
  name: string;
  basePrice: number;
  unitPrice: number; // basePrice + sum of selected options
  quantity: number;
  image: string;
  selectedOptions: CartSelectedOption[];
  specialInstructions?: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  area?: string;
  nearbyLandmark?: string;
  orderNotes?: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderReference: string; // e.g. "DF-8942"
  createdAt: string;
  updatedAt: string;
  orderType: OrderType;
  branchId: string;
  branchName: string;
  branchPhone: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'verified';
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  estimatedDeliveryOrPickupTime: string;
}

export interface Reservation {
  id: string;
  referenceNumber: string;
  branchId: string;
  branchName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'seated' | 'cancelled';
  createdAt: string;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'resolved';
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  brandStory: string;
  cuisineType: string;
  currency: string;
  currencySymbol: string;
  logoText: string;
  logoSubtext: string;
  contactPhone: string;
  whatsappNumber: string;
  email: string;
  headquartersAddress: string;
  openingHoursSummary: string;
  googleMapsUrl: string;
  socials: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  features: {
    deliveryEnabled: boolean;
    pickupEnabled: boolean;
    reservationsEnabled: boolean;
    dealsEnabled: boolean;
    onlinePaymentEnabled: boolean;
    branchSelectionEnabled: boolean;
  };
  pricing: {
    taxRatePercent: number; // e.g. 5% provincial sales tax or 0%
    standardDeliveryFee: number;
    minimumOrderAmount: number;
  };
  theme: {
    primaryColor: string; // e.g. #B64E35
    primaryHover: string; // e.g. #9E3E27
    backgroundColor: string; // #FAF8F4
    textColor: string; // #25231F
    accentColor: string; // #F5E9E2
  };
}

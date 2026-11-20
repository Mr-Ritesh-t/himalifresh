interface WhatsAppOrderPayload {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  landmark?: string | null;
  instructions?: string | null;
  totalAmount: number;
  items: Array<{
    name: string;
    weight?: string | null;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
}

export function buildWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
  const itemsText = payload.items
    .map(
      (item, index) =>
        `${index + 1}. *${item.name}* ${item.weight ? `(${item.weight})` : ''} x ${item.quantity} = ₹${item.subtotal.toFixed(0)}`
    )
    .join('\n');

  const landmarkText = payload.landmark ? `\n*Landmark:* ${payload.landmark}` : '';
  const instructionsText = payload.instructions ? `\n*Notes/Instructions:* ${payload.instructions}` : '';

  return `🏔️ *HIMALI FRESH - NEW ORDER ENQUIRY*
━━━━━━━━━━━━━━━━━━━━
*Order Ref:* #${payload.orderNumber}
*Customer:* ${payload.customerName}
*Phone:* ${payload.phone}
*Delivery Address:* ${payload.address}, ${payload.city} - ${payload.pincode}${landmarkText}${instructionsText}

📦 *ORDER ITEMS:*
${itemsText}

💰 *TOTAL ESTIMATED AMOUNT:* ₹${payload.totalAmount.toFixed(0)}
━━━━━━━━━━━━━━━━━━━━
_Note: I have submitted this order enquiry on Himali Fresh. Please confirm product availability, payment, and delivery schedule._`;
}

export function generateWhatsAppUrl(whatsappNumber: string, message: string): string {
  const cleanedNumber = whatsappNumber.replace(/[^\d]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanedNumber}?text=${encodedMessage}`;
}

'use strict';

let buildCartItems = (tags, allItems) => {
  const cartItems = [];

  for (let tag of tags) {
    let tagArray = tag.split('-');
    let barcode = tagArray[0];
    let count = parseFloat(tagArray[1] || 1);

    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if (cartItem) {
      cartItem.count++;
    }
    else {
      let item = allItems.find(item => item.barcode === barcode);
      cartItems.push({item: item, count: count});
    }
  }

  return cartItems;
};

let buildReceiptItems = (cartItems, promotions) => {

  let receiptItems = [];
  for (let cartItem of cartItems) {
    let subtotal = cartItem.item.price * cartItem.count;
    let saved = 0;

    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
      saved = cartItem.item.price * parseInt(cartItem.count / 3);
      subtotal -= saved;
    }

    receiptItems.push({cartItem: cartItem, subtotal: subtotal, saved: saved});
  }

  return receiptItems;
};

let getPromotionType = (barcode, promotions) => {

  let promotion = promotions.find(promotion => promotion.barcodes.includes(barcode));
  if (promotion) {
    return promotion.type;
  }
};

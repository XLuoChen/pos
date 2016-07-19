'use strict';

let printReceipt = (tags) => {

  let allItems = loadAllItems();
  let cartItems = buildCartItems(tags, allItems);

  let promotions = loadPromotions();
  let receiptItems = buildReceiptItems(cartItems, promotions);

  let receipt = buildReceipt(receiptItems);

  let receiptText = buildReceiptText(receipt);

  console.log(receiptText);
};

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

  return cartItems.map((cartItem) => {

    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {subtotal, saved} = discount(cartItem, promotionType);

    return {cartItem, subtotal: subtotal, saved};
  });
};

let getPromotionType = (barcode, promotions) => {

  let promotion = promotions.find(promotion => promotion.barcodes.includes(barcode));

  return promotion ? promotion.type : '';
};

let discount = (cartItem, promotionType) => {

  let freeCounted = 0;

  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    freeCounted = parseInt(cartItem.count / 3);
  }

  let saved = cartItem.item.price * freeCounted;
  let subtotal = cartItem.item.price * cartItem.count - saved;

  return {subtotal, saved};
};

let buildReceipt = (receiptItems) => {

  let total = 0;
  let savedTotal = 0;

  for (let receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    savedTotal += receiptItem.saved;
  }

  return {receiptItems, total, savedTotal};
};

let buildReceiptText = (receipt) => {

  return `***<没钱赚商店>收据***${generateItemText(receipt.receiptItems)}
----------------------
总计：${priceToFixed(receipt.total)}(元)
节省：${priceToFixed(receipt.savedTotal)}(元)
**********************`
};

let generateItemText = (receiptItems) => {

  let itemText = '';

  for (let receiptItem of receiptItems) {
    let item = receiptItem.cartItem.item;

    itemText +=
      `\n名称：${item.name}，数量：${receiptItem.cartItem.count}${item.unit}，单价：${priceToFixed(item.price)}(元)，小计：${priceToFixed(receiptItem.subtotal)}(元)`;
  }
  return itemText;
};

let priceToFixed = (price) => {
  return price.toFixed(2);
};

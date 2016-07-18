'use strict';

var buildCartItems = (tags, allItems) => {
  let cartItems = [];

  for (let tag of tags) {
    let tagArray = tag.split('-');
    let barcode = tagArray[0];

    let count = parseFloat(tagArray[1] || 1);

    var cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);
    if (cartItem != null) {
      cartItem.count++;
    }
    else {
      let item = allItems.find(item => item.barcode === barcode);
      cartItems.push({item: item, count: count});
    }
  }

  return cartItems;
};


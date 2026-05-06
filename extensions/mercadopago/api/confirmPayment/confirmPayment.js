const { select } = require("@evershop/postgres-query-builder");
const { pool } = require("@evershop/evershop/src/lib/postgres/connection");
const {
  updatePaymentStatus,
} = require("@evershop/evershop/src/modules/oms/services/updatePaymentStatus");

module.exports = async (request, response, stack, next) => {
  try {
    const { orderId } = request.body;
    const order = await select()
      .from("order")
      .where("uuid", "=", orderId)
      .load(pool);

    await updatePaymentStatus(order.order_id, "paid");
    return response.json({ status: 200 });
  } catch (e) {
    console.log(e);
    
    return;
  }
};

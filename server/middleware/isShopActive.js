import StoreModel from "../models/StoreModels.js";

const isShopActive = async (req, res, next) => {
  const { shop, host } = req.query;

  if (!shop) {
    next();
    return;
  }

  const isShopAvaialble = await StoreModel.findOne({where : {shop : shop}})

  // const isShopAvaialble = await StoreModel.findOne({ shop });

  if (isShopAvaialble === null || !isShopAvaialble.isActive) {
    if (isShopAvaialble === null) {

      await StoreModel.create({
        shop :  shop ,
        isActive : false
      })

      // await StoreModel.create({ shop, isActive: false });
    } else if (!isShopAvaialble.isActive) {

      await StoreModel.update(
        {
          isActive : false
        },
        {
          where : {shop : shop},
          limit : 1
        }
      )
      // await StoreModel.findOneAndUpdate({ shop }, { isActive: false });
    }
    res.redirect(`${process.env.SHOPIFY_APP_URL}/api/auth?shop=${shop}&host=${host}`);
  } else {
    next();
  }
};

export default isShopActive;

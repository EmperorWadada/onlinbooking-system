
const advancedResult = (model, populate) => async( req, res, next) => {

let reqString = {...req.query};
let query;

const removedField = ['select', 'sort', 'skip', 'limit', 'page'];
// Remove mongoose key words from reqString
 removedField.forEach(paramsRemoved => delete reqString[paramsRemoved]);

let convertReqStringToJson = JSON.stringify(reqString);
 convertReqStringToJson = convertReqStringToJson.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

query = model.find(JSON.parse(convertReqStringToJson));

if (populate) {
  query.populate(populate);
}

if (req.query.select) {
  const selectFields = req.query.select.split(',').join(' ')
   query = query.select(selectFields);
}

if (req.query.sort){
  const sortFields = req.query.sort.split(',').join(' ')
  query = query.sort(sortFields)
}

const total =  await model.countDocuments();
const limit = parseInt(req.query.limit, 10) || 100;
const page = parseInt(req.query.page, 10) || 1;

const startIndex = (page -1) * limit;
const endIndex = page * limit;

query = query.skip(startIndex).limit(limit);

const result = await query;

const navigation = {};

if ( startIndex > 0 ) {
  navigation.prev = {
    page: page -1,
    limit
  };
}

if ( endIndex < total ) {
  navigation.next = {
    page: page + 1,
    limit
  };
}

res.advancedResult = {
  success: true,
  count: result.length,
  navigation,
  data: result
};


  next();
}


module.exports = advancedResult;
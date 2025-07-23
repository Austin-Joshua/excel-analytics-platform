const xlsx = require('xlsx');
const fs = require('fs');
const File = require('../models/File');

exports.uploadFile = async (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  await File.create({ userId: req.body.userId, data });
  fs.unlinkSync(req.file.path);
  res.json(data);
};

exports.getHistory = async (req, res) => {
  const history = await File.find({ userId: req.params.userId });
  res.json(history);
};

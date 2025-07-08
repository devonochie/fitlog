const Templates = require('../models/Templates')


const createTemplates = async (req, res) => {
   const {name, exercise} = req.body
   try {
      const templates = new Templates({
         name, exercise, userId: req.user.userId
      })
      await templates.save()
      res.status(201).json({success: true, message: 'Templates created successfully', templates})
   } catch (error) {
      res.status(500).json({success: false, message: 'error creating templates', error})
   }
   
}

const getTemplates = async (req, res) => {
   try {
      const templates = await Templates.find()
      res.status(200).json({success: true, templates})
   } catch (error) {
      res.status(500).json({success: false, message:'error getting tempaltes', error})
   }
   
}

const updateTemplates = async (req, res) => {
   const {name, exercise} = req.body
   try {
      const templates = await Templates.findByIdAndUpdate(req.params.id, {name, exercise}, {new:true, runValidators: true})
      if (!templates) {
         return res.status(404).json({ success: false, message: 'Template not found' });
      }
      res.status(200).json({success: true, templates})
   } catch (error) {
      res.status(500).json({success: false, message: 'Error updating templates',error})
   }
}

const deletTemplates = async (req, res) => {
   try {
     const templates =  await Templates.findByIdAndDelete(req.params.id)
     if(!templates){
      return res.status(404).json({success: false, message: 'Templates not found'})
     }
     res.status(200).json({success: false, message: 'Templates deleted successfuly'})
   } catch (error) {
      res.status(500).json({success: false, message: 'Error deleting templates', error})
   }
 
}

module.exports = {getTemplates, createTemplates, updateTemplates, deletTemplates}
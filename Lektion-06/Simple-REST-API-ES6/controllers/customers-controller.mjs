import customers from '../data/customers.json' with {type:"json"};
import {v4 as uuidv4} from 'uuid';
import ResponseModel from '../utilities/ResponseModel.mjs';
import ErrorResponse from '../utilities/ErrorResponseModel.mjs';
import fileHandler from '../utilities/fileHandler.mjs';

const folder = 'data';
const file = 'customers.json';

export const listCustomers = (req, res, next) => {
  res.status(200).json(new ResponseModel({ statusCode: 200, data: customers }));
};

export const findCustomer = (req, res, next) => {
  const customer = getCustomer(req, res, next);

  if (customer) {
    res
      .status(200)
      .json(new ResponseModel({ statusCode: 200, data: customer }));
  }
};

export const addCustomer = (req, res, next) => {
  const id = uuidv4().replaceAll('-', '');
  req.body.id = id;

  customers.push(req.body);

  fileHandler(folder, file, customers);

  res.status(201).json(new ResponseModel({ statusCode: 201, data: req.body }));
};

export const updateCustomer = (req, res, next) => {
  const customer = getCustomer(req, res, next);

  if (customer) {
    customer.name = req.body.name ?? customer.name;
    customer.phone = req.body.phone ?? customer.phone;
    customer.email = req.body.email ?? customer.email;
    customer.contactPerson = req.body.contactPerson ?? customer.contactPerson;
    customer.comment = req.body.comment ?? customer.comment;
    customer.active = req.body.active ?? customer.active;

    if (req.body.address) {
      customer.address.street =
        req.body.address.street ?? customer.address.street;
      customer.address.postalCode =
        req.body.address.postalCode ?? customer.address.postalCode;
      customer.address.city = req.body.address.city ?? customer.address.city;
    }

    fileHandler(folder, file, customers);
    res.status(204).end();
  }
};

export const updateCustomerActive = (req, res, next) => {
  const customer = getCustomer(req, res, next);

  if (customer) {
    customer.active = req.body.active ?? customer.active;

    fileHandler(folder, file, customers);
    res.status(204).end();
  }
};

export const deleteCustomer = (req, res, next) => {
  const customer = getCustomer(req, res, next);

  if (customer) {
    customers.splice(customers.indexOf(customer), 1);

    fileHandler(folder, file, customers);
    res.status(204).end();
  }
};

const getCustomer = (req, res, next) => {
  const customer = customers.find((c) => c.id === req.params.id);

  if (!customer) {
    return next(
      new ErrorResponse(`Kunde inte hitta någon kund med id: ${req.params.id}`)
    );
  }

  return customer;
};

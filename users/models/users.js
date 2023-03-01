const db = require('../database');
const moment = require('moment');

exports.getDetailsById = async(id) => {
    const query = db.read.select('*')
        .from('users')
        .where('id', '=', id);
    return query;
};

exports.getUserDetailsByEmail = async(email) => {
    const query = db.read.select('*')
        .from('users')
        .where('email', '=', email);
    return query;
};

exports.getUserDetailsByNameOrEmail = async(input) => {
    const query = db.read.select('*')
        .from('users')
        .where('name', '=', input)
        .orWhere('email', '=', input);
    return query;
};

exports.createUser = async(data) => {
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const query = db.write('users').insert({
        name: data.name || null,
        email: data.email || null,
        password: data.password || null,
        about_me: data.about_me || null,
        phone: data.phone || null,
        verified_email: data.verified_email || 0,
        verified_phone: data.verified_phone || 0,
        DOB: data.DOB || null,
        street: data.street || null,
        city: data.city || null,
        zipcode: data.zipcode || null,
        state: data.state || null,
        country: data.country || null,
        picture: data.picture || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        created_at: createdAt,
        updated_at: createdAt
    });
    console.info("query -->", query.toQuery())
    return query;
};


exports.createPermission = async(data) => {
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const query = db.write('user_permission').insert({
        user_id: data.user_id,
        role_id: data.role_id || 1,
        created_at: createdAt,
        updated_at: createdAt
    });
    console.info("query -->", query.toQuery())
    return query;
};

exports.createUserRole = async(data) => {
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const query = db.write('user_role').insert({
        role: data.role,
        created_at: createdAt,
        updated_at: createdAt
    });
    console.info("query -->", query.toQuery())
    return query;
};


exports.createUserToken = async(data) => {
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const query = db.write('invalid_token').insert({
        token: data.token,
        expiry: data.expiry,
        created_at: createdAt,
        updated_at: createdAt
    });
    console.info("query -->", query.toQuery())
    return query;
};

exports.getUserPermission = async(user_id) => {
    const query = db.read.select('user_role.role')
        .from('user_permission')
        .join('user_role', 'user_permission.role_id', '=', 'user_role.id')
        .where('user_id', '=', user_id)
    console.info("query -->", query.toQuery())
    return query;
};

exports.createSeller = async(data) => {
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    const query = db.write('seller').insert({
        user_id: data.user_id || null,
        name: data.name || null,
        about_us: data.about_us || null,
        email: data.email || null,
        phone: data.phone || null,
        verified_phone: data.verified_phone || 0,
        verified_email: data.verified_email || 0,
        verified_account: data.verified_account || 0,
        DOB: data.DOB || null,
        street: data.street || null,
        city: data.city || null,
        zipcode: data.zipcode || null,
        state: data.state || null,
        country: data.country || null,
        logo: data.logo || null,
        created_at: createdAt,
        updated_at: createdAt
    });
    console.info("query -->", query.toQuery())
    return query;
};

exports.getSellerDetailsByUserId = async(user_id) => {
    const query = db.read.select('*')
        .from('seller')
        .where('user_id', '=', user_id);;
    return query;
};
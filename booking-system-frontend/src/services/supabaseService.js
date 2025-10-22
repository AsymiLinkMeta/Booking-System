import { supabase } from '../lib/supabaseClient';

export const businessService = {
  async getAll() {
    const { data, error } = await supabase
      .from('business')
      .select(`
        *,
        user:ownerId (id, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('business')
      .select(`
        *,
        user:ownerId (id, email),
        service (*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getByOwnerId(ownerId) {
    const { data, error } = await supabase
      .from('business')
      .select('*')
      .eq('ownerId', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(businessData) {
    const { data, error } = await supabase
      .from('business')
      .insert([businessData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, businessData) {
    const { data, error } = await supabase
      .from('business')
      .update(businessData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('business')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const serviceService = {
  async getByBusinessId(businessId) {
    const { data, error } = await supabase
      .from('service')
      .select('*')
      .eq('businessId', businessId)
      .eq('isDeleted', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(serviceData) {
    const { data, error } = await supabase
      .from('service')
      .insert([serviceData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, serviceData) {
    const { data, error } = await supabase
      .from('service')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from('service')
      .update({ isDeleted: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const bookingService = {
  async getAll() {
    const { data, error } = await supabase
      .from('booking')
      .select(`
        *,
        business (*),
        service (*),
        user:customerId (id, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getByCustomerId(customerId) {
    const { data, error } = await supabase
      .from('booking')
      .select(`
        *,
        business (id, name),
        service (id, serviceName, price)
      `)
      .eq('customerId', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getByBusinessId(businessId) {
    const { data, error } = await supabase
      .from('booking')
      .select(`
        *,
        service (id, serviceName),
        user:customerId (id, email)
      `)
      .eq('businessId', businessId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('booking')
      .select(`
        *,
        business (*),
        service (*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(bookingData) {
    const { data, error } = await supabase
      .from('booking')
      .insert([bookingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, bookingData) {
    const { data, error } = await supabase
      .from('booking')
      .update(bookingData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('booking')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const reviewService = {
  async getByBusinessId(businessId) {
    const { data, error } = await supabase
      .from('review')
      .select(`
        *,
        user:userId (id, email),
        service (id, serviceName)
      `)
      .eq('businessId', businessId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getByUserId(userId) {
    const { data, error } = await supabase
      .from('review')
      .select(`
        *,
        business (id, name),
        service (id, serviceName)
      `)
      .eq('userId', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(reviewData) {
    const { data, error } = await supabase
      .from('review')
      .insert([reviewData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, reviewData) {
    const { data, error } = await supabase
      .from('review')
      .update(reviewData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('review')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const userService = {
  async getAll() {
    const { data, error } = await supabase
      .from('user')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('user')
      .select('id, email, role, created_at')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async update(id, userData) {
    const { data, error } = await supabase
      .from('user')
      .update(userData)
      .eq('id', id)
      .select('id, email, role, created_at')
      .single();

    if (error) throw error;
    return data;
  }
};

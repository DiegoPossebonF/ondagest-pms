import { z } from "zod";

// Usuário
export const createUserSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
	role: z.enum(["ADMIN", "EMPLOYEE"]),
});

export const userResponseSchema = createUserSchema
	.extend({
		id: z.string().uuid(),
	})
	.omit({ password: true });

// Login
export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

// Hóspede
export const createGuestSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	phone: z.string().optional(),
});

export const guestResponseSchema = createGuestSchema.extend({
	id: z.string().uuid(),
});

// Tipo de Unidade (UnitType)
export const createUnitTypeSchema = z.object({
	name: z.string().min(2),
	description: z.string().optional(),
});

export const unitTypeResponseSchema = createUnitTypeSchema.extend({
	id: z.string().uuid(),
});

// Unidade (Unit)
export const createUnitSchema = z.object({
	number: z.string(),
	typeId: z.string(),
});

export const unitResponseSchema = createUnitSchema.extend({
	id: z.string().uuid(),
});

// Tarifa (Rate)
export const createRateSchema = z.object({
	typeId: z.string(),
	name: z.string(),
	value: z.number(),
});

export const rateResponseSchema = createRateSchema.extend({
	id: z.string().uuid(),
});

// Reserva (Booking)
export const createBookingSchema = z.object({
	guestId: z.string(),
	unitId: z.string(),
	startDate: z.string(),
	endDate: z.string(),
});

export const bookingResponseSchema = createBookingSchema.extend({
	id: z.string().uuid(),
});

// Pagamento (Payment)
export const createPaymentSchema = z.object({
	bookingId: z.string(),
	amount: z.number(),
});

export const paymentResponseSchema = createPaymentSchema.extend({
	id: z.string().uuid(),
});

export const idSchema = z.object({
	id: z.string().uuid({ message: "ID inválido" }),
});

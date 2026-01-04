export interface Notice {
	_id: string;
	title: string;
	date: string;
	content: string | string[];
	type: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface NoticeList {
	success: boolean;
	data: Notice[];
}

// About Page Types
export interface FeatureItem {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	title: string;
	description: string;
	color?: string;
}

export interface AchievementItem {
	number: string;
	label: string;
}

export interface ProgramItem {
	name: string;
	duration: string;
	description: string;
}

export interface ValueItem {
	title: string;
	description: string;
}

// Admission Page Types
export interface AdmissionClass {
	class: string;
	duration: string;
	fees: string;
	capacity: string;
}

export interface FAQItem {
	q: string;
	a: string;
}

// Departments Page Types
export interface Department {
	id: number;
	name: string;
	description: string;
	icon: React.ReactNode;
	color: string;
	details: string;
}

// Result Page Types
export interface Term {
	id: string;
	label: string;
}

export interface Division {
	id: string;
	label: string;
}

export interface Class {
	id: string;
	label: string;
}

export interface Subject {
	name: string;
	marks: number;
	total: number;
}

export interface StudentResult {
	name: string;
	roll: string | number;
	department: string;
	class: string;
	term: string;
	totalMarks: number;
	subjects: Subject[];
	examDate: string;
	resultDate: string;
	examYear: string;
	principal: string;
}

// Contact Page Types
export interface FormData {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
}

export interface ContactInfoItem {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	title: string;
	details: string;
	color?: string;
}

export interface DepartmentItem {
	name: string;
	phone: string;
	email: string;
}

export interface Faq {
	id: string;
	question: string;
	answer: string;
	category: string;
	isActive?: boolean;
	order: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface FaqResponse {
	success: boolean;
	data: Faq[];
}

// Gallery Types
export interface GalleryImage {
	_id: string;
	imageUrl: string;
	title?: string;
	isActive?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface GalleryResponse {
	success: boolean;
	data: GalleryImage[];
}

// Speech Types
export interface SpeechData {
	_id: string;
	name: string;
	role: string;
	subtitle: string;
	arabic: string;
	bengaliGreeting: string;
	message: string;
	image: string;
}

export interface SpeechResponse {
	success: boolean;
	data: SpeechData;
}

// Testimonial Types
export interface TestimonialItem {
	_id: string;
	name: string;
	location?: string;
	message: string;
	image?: string;
	rating?: number;
}

export interface TestimonialResponse {
	success: boolean;
	data: TestimonialItem[];
}

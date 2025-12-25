"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, isValid, parse } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
	date?: Date;
	onSelect?: (date: Date | undefined) => void;
	placeholder?: string;
	className?: string;
}

export function DatePicker({
	date,
	onSelect,
	placeholder = "Pick a date",
	className,
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState(
		date ? format(date, "PPP") : ""
	);
	const [month, setMonth] = React.useState<Date | undefined>(date);

	React.useEffect(() => {
		if (date) {
			setInputValue(format(date, "PPP"));
			setMonth(date);
		} else {
			setInputValue("");
		}
	}, [date]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);

		// Try different formats to detect valid date
		const formats = [
			"PPP",
			"dd-MM-yyyy",
			"d-M-yyyy",
			"yyyy-MM-dd",
			"MM/dd/yyyy",
			"d/M/yyyy",
		];
		let detectedDate: Date | undefined;

		for (const fmt of formats) {
			const parsed = parse(value, fmt, new Date());
			if (isValid(parsed) && parsed.getFullYear() > 1900) {
				detectedDate = parsed;
				break;
			}
		}

		if (detectedDate) {
			onSelect?.(detectedDate);
			setMonth(detectedDate);
		}
	};

	return (
		<div className={cn("relative flex gap-2", className)}>
			<Input
				value={inputValue}
				placeholder={placeholder}
				className="bg-background pr-10"
				onChange={handleInputChange}
				onKeyDown={(e) => {
					if (e.key === "ArrowDown") {
						e.preventDefault();
						setOpen(true);
					}
				}}
			/>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
					>
						<CalendarIcon className="size-4" />
						<span className="sr-only">Select date</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="end">
					<Calendar
						mode="single"
						selected={date}
						captionLayout="dropdown"
						month={month}
						onMonthChange={setMonth}
						onSelect={(newDate) => {
							onSelect?.(newDate);
							if (newDate) {
								setInputValue(format(newDate, "PPP"));
							}
							setOpen(false);
						}}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}

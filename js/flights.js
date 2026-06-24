// ========== COMPLETE FLIGHT DATASET - ALL CITY PAIRS ==========
const allFlights = [
    // ========== CHENNAI (MAA) TO ALL CITIES ==========
    // Chennai to Delhi
    { id: 1, airline: "Air India", flightNo: "AI202", origin: "Chennai (MAA)", dest: "Delhi (DEL)", dept: "08:30", arr: "11:45", duration: "3h 15m", economyPrice: 4500, businessPrice: 12000, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 2, airline: "IndiGo", flightNo: "6E345", origin: "Chennai (MAA)", dest: "Delhi (DEL)", dept: "10:00", arr: "13:15", duration: "3h 15m", economyPrice: 3800, businessPrice: 9500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320neo" },
    { id: 3, airline: "SpiceJet", flightNo: "SG101", origin: "Chennai (MAA)", dest: "Delhi (DEL)", dept: "14:20", arr: "17:35", duration: "3h 15m", economyPrice: 4200, businessPrice: 10500, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737" },
    { id: 4, airline: "Vistara", flightNo: "UK832", origin: "Chennai (MAA)", dest: "Delhi (DEL)", dept: "17:20", arr: "20:10", duration: "2h 50m", economyPrice: 4900, businessPrice: 13500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A321" },
    { id: 5, airline: "Akasa Air", flightNo: "QP112", origin: "Chennai (MAA)", dest: "Delhi (DEL)", dept: "06:15", arr: "09:30", duration: "3h 15m", economyPrice: 3600, businessPrice: 8900, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737 MAX" },
    
    // Chennai to Mumbai
    { id: 6, airline: "Air India", flightNo: "AI571", origin: "Chennai (MAA)", dest: "Mumbai (BOM)", dept: "07:00", arr: "09:00", duration: "2h 00m", economyPrice: 3500, businessPrice: 9500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    { id: 7, airline: "IndiGo", flightNo: "6E123", origin: "Chennai (MAA)", dest: "Mumbai (BOM)", dept: "13:30", arr: "15:30", duration: "2h 00m", economyPrice: 3200, businessPrice: 8500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 8, airline: "SpiceJet", flightNo: "SG456", origin: "Chennai (MAA)", dest: "Mumbai (BOM)", dept: "18:45", arr: "20:45", duration: "2h 00m", economyPrice: 3800, businessPrice: 9900, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737" },
    { id: 9, airline: "Vistara", flightNo: "UK456", origin: "Chennai (MAA)", dest: "Mumbai (BOM)", dept: "20:30", arr: "22:30", duration: "2h 00m", economyPrice: 4100, businessPrice: 10800, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    
    // Chennai to Bengaluru
    { id: 10, airline: "IndiGo", flightNo: "6E456", origin: "Chennai (MAA)", dest: "Bengaluru (BLR)", dept: "09:15", arr: "10:15", duration: "1h 00m", economyPrice: 1800, businessPrice: 4500, category: "domestic", stops: "Non-stop", aircraft: "ATR 72" },
    { id: 11, airline: "Air India", flightNo: "AI502", origin: "Chennai (MAA)", dest: "Bengaluru (BLR)", dept: "16:30", arr: "17:30", duration: "1h 00m", economyPrice: 2200, businessPrice: 5500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 12, airline: "SpiceJet", flightNo: "SG789", origin: "Chennai (MAA)", dest: "Bengaluru (BLR)", dept: "12:00", arr: "13:00", duration: "1h 00m", economyPrice: 1900, businessPrice: 4800, category: "domestic", stops: "Non-stop", aircraft: "Bombardier Q400" },
    
    // Chennai to Kolkata
    { id: 13, airline: "IndiGo", flightNo: "6E678", origin: "Chennai (MAA)", dest: "Kolkata (CCU)", dept: "11:30", arr: "14:00", duration: "2h 30m", economyPrice: 3900, businessPrice: 10200, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 14, airline: "Air India", flightNo: "AI895", origin: "Chennai (MAA)", dest: "Kolkata (CCU)", dept: "19:00", arr: "21:30", duration: "2h 30m", economyPrice: 4200, businessPrice: 11000, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // Chennai to Hyderabad
    { id: 15, airline: "IndiGo", flightNo: "6E234", origin: "Chennai (MAA)", dest: "Hyderabad (HYD)", dept: "07:30", arr: "08:45", duration: "1h 15m", economyPrice: 2500, businessPrice: 6500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 16, airline: "SpiceJet", flightNo: "SG345", origin: "Chennai (MAA)", dest: "Hyderabad (HYD)", dept: "15:45", arr: "17:00", duration: "1h 15m", economyPrice: 2300, businessPrice: 6000, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737" },
    
    // Chennai to Kochi
    { id: 17, airline: "IndiGo", flightNo: "6E567", origin: "Chennai (MAA)", dest: "Kochi (COK)", dept: "10:00", arr: "11:15", duration: "1h 15m", economyPrice: 2200, businessPrice: 5800, category: "domestic", stops: "Non-stop", aircraft: "ATR 72" },
    { id: 18, airline: "Air India", flightNo: "AI541", origin: "Chennai (MAA)", dest: "Kochi (COK)", dept: "17:30", arr: "18:45", duration: "1h 15m", economyPrice: 2500, businessPrice: 6500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // Chennai to Goa
    { id: 19, airline: "IndiGo", flightNo: "6E890", origin: "Chennai (MAA)", dest: "Goa (GOI)", dept: "06:00", arr: "07:30", duration: "1h 30m", economyPrice: 3200, businessPrice: 8500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 20, airline: "SpiceJet", flightNo: "SG567", origin: "Chennai (MAA)", dest: "Goa (GOI)", dept: "14:00", arr: "15:30", duration: "1h 30m", economyPrice: 3500, businessPrice: 9200, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737" },
    
    // Chennai to Coimbatore
    { id: 21, airline: "IndiGo", flightNo: "6E789", origin: "Chennai (MAA)", dest: "Coimbatore (CJB)", dept: "08:30", arr: "09:30", duration: "1h 00m", economyPrice: 1500, businessPrice: 4000, category: "domestic", stops: "Non-stop", aircraft: "ATR 72" },
    
    // Chennai to Vizag
    { id: 22, airline: "IndiGo", flightNo: "6E901", origin: "Chennai (MAA)", dest: "Visakhapatnam (VTZ)", dept: "12:00", arr: "13:15", duration: "1h 15m", economyPrice: 2100, businessPrice: 5500, category: "domestic", stops: "Non-stop", aircraft: "ATR 72" },
    
    // ========== DELHI (DEL) TO ALL CITIES ==========
    // Delhi to Mumbai
    { id: 23, airline: "Air India", flightNo: "AI505", origin: "Delhi (DEL)", dest: "Mumbai (BOM)", dept: "09:00", arr: "11:15", duration: "2h 15m", economyPrice: 4800, businessPrice: 12500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A321" },
    { id: 24, airline: "IndiGo", flightNo: "6E212", origin: "Delhi (DEL)", dest: "Mumbai (BOM)", dept: "15:30", arr: "17:45", duration: "2h 15m", economyPrice: 4200, businessPrice: 11000, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 25, airline: "SpiceJet", flightNo: "SG111", origin: "Delhi (DEL)", dest: "Mumbai (BOM)", dept: "11:00", arr: "13:15", duration: "2h 15m", economyPrice: 4500, businessPrice: 11800, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737" },
    { id: 26, airline: "Vistara", flightNo: "UK955", origin: "Delhi (DEL)", dest: "Mumbai (BOM)", dept: "20:30", arr: "22:45", duration: "2h 15m", economyPrice: 5200, businessPrice: 13500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 27, airline: "Akasa Air", flightNo: "QP123", origin: "Delhi (DEL)", dest: "Mumbai (BOM)", dept: "07:00", arr: "09:15", duration: "2h 15m", economyPrice: 3900, businessPrice: 10200, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737 MAX" },
    
    // Delhi to Chennai
    { id: 28, airline: "Air India", flightNo: "AI203", origin: "Delhi (DEL)", dest: "Chennai (MAA)", dept: "12:30", arr: "15:45", duration: "3h 15m", economyPrice: 4600, businessPrice: 12200, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 29, airline: "IndiGo", flightNo: "6E346", origin: "Delhi (DEL)", dest: "Chennai (MAA)", dept: "18:00", arr: "21:15", duration: "3h 15m", economyPrice: 4000, businessPrice: 10500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320neo" },
    
    // Delhi to Bengaluru
    { id: 30, airline: "IndiGo", flightNo: "6E567", origin: "Delhi (DEL)", dest: "Bengaluru (BLR)", dept: "08:00", arr: "10:45", duration: "2h 45m", economyPrice: 4800, businessPrice: 12500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 31, airline: "Air India", flightNo: "AI802", origin: "Delhi (DEL)", dest: "Bengaluru (BLR)", dept: "14:30", arr: "17:15", duration: "2h 45m", economyPrice: 5200, businessPrice: 13500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A321" },
    { id: 32, airline: "Vistara", flightNo: "UK877", origin: "Delhi (DEL)", dest: "Bengaluru (BLR)", dept: "21:00", arr: "23:45", duration: "2h 45m", economyPrice: 5500, businessPrice: 14200, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    
    // Delhi to Kolkata
    { id: 33, airline: "IndiGo", flightNo: "6E234", origin: "Delhi (DEL)", dest: "Kolkata (CCU)", dept: "09:30", arr: "11:45", duration: "2h 15m", economyPrice: 4300, businessPrice: 11200, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 34, airline: "Air India", flightNo: "AI703", origin: "Delhi (DEL)", dest: "Kolkata (CCU)", dept: "16:00", arr: "18:15", duration: "2h 15m", economyPrice: 4600, businessPrice: 12000, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // Delhi to Goa
    { id: 35, airline: "IndiGo", flightNo: "6E789", origin: "Delhi (DEL)", dest: "Goa (GOI)", dept: "07:30", arr: "10:15", duration: "2h 45m", economyPrice: 5600, businessPrice: 14500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 36, airline: "SpiceJet", flightNo: "SG234", origin: "Delhi (DEL)", dest: "Goa (GOI)", dept: "13:00", arr: "15:45", duration: "2h 45m", economyPrice: 5800, businessPrice: 15000, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737" },
    
    // Delhi to Hyderabad
    { id: 37, airline: "IndiGo", flightNo: "6E456", origin: "Delhi (DEL)", dest: "Hyderabad (HYD)", dept: "11:00", arr: "13:15", duration: "2h 15m", economyPrice: 4400, businessPrice: 11500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 38, airline: "Air India", flightNo: "AI775", origin: "Delhi (DEL)", dest: "Hyderabad (HYD)", dept: "18:30", arr: "20:45", duration: "2h 15m", economyPrice: 4700, businessPrice: 12200, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // Delhi to Jaipur
    { id: 39, airline: "IndiGo", flightNo: "6E123", origin: "Delhi (DEL)", dest: "Jaipur (JAI)", dept: "08:00", arr: "09:00", duration: "1h 00m", economyPrice: 2500, businessPrice: 6500, category: "domestic", stops: "Non-stop", aircraft: "ATR 72" },
    { id: 40, airline: "SpiceJet", flightNo: "SG345", origin: "Delhi (DEL)", dest: "Jaipur (JAI)", dept: "16:30", arr: "17:30", duration: "1h 00m", economyPrice: 2300, businessPrice: 6000, category: "domestic", stops: "Non-stop", aircraft: "Bombardier Q400" },
    
    // Delhi to Lucknow
    { id: 41, airline: "IndiGo", flightNo: "6E567", origin: "Delhi (DEL)", dest: "Lucknow (LKO)", dept: "10:30", arr: "11:30", duration: "1h 00m", economyPrice: 2800, businessPrice: 7200, category: "domestic", stops: "Non-stop", aircraft: "ATR 72" },
    { id: 42, airline: "Air India", flightNo: "AI431", origin: "Delhi (DEL)", dest: "Lucknow (LKO)", dept: "18:00", arr: "19:00", duration: "1h 00m", economyPrice: 3200, businessPrice: 8200, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // Delhi to Chandigarh
    { id: 43, airline: "IndiGo", flightNo: "6E789", origin: "Delhi (DEL)", dest: "Chandigarh (IXC)", dept: "07:30", arr: "08:30", duration: "1h 00m", economyPrice: 3000, businessPrice: 7800, category: "domestic", stops: "Non-stop", aircraft: "ATR 72" },
    { id: 44, airline: "Vistara", flightNo: "UK611", origin: "Delhi (DEL)", dest: "Chandigarh (IXC)", dept: "15:30", arr: "16:30", duration: "1h 00m", economyPrice: 3500, businessPrice: 9000, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    
    // Delhi to Srinagar
    { id: 45, airline: "IndiGo", flightNo: "6E901", origin: "Delhi (DEL)", dest: "Srinagar (SXR)", dept: "09:00", arr: "11:00", duration: "2h 00m", economyPrice: 5500, businessPrice: 14200, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 46, airline: "Air India", flightNo: "AI890", origin: "Delhi (DEL)", dest: "Srinagar (SXR)", dept: "14:00", arr: "16:00", duration: "2h 00m", economyPrice: 5800, businessPrice: 15000, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // ========== MUMBAI (BOM) TO ALL CITIES ==========
    // Mumbai to Delhi
    { id: 47, airline: "Air India", flightNo: "AI506", origin: "Mumbai (BOM)", dest: "Delhi (DEL)", dept: "12:00", arr: "14:15", duration: "2h 15m", economyPrice: 4700, businessPrice: 12300, category: "domestic", stops: "Non-stop", aircraft: "Airbus A321" },
    { id: 48, airline: "IndiGo", flightNo: "6E213", origin: "Mumbai (BOM)", dest: "Delhi (DEL)", dept: "18:00", arr: "20:15", duration: "2h 15m", economyPrice: 4100, businessPrice: 10800, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    
    // Mumbai to Chennai
    { id: 49, airline: "IndiGo", flightNo: "6E124", origin: "Mumbai (BOM)", dest: "Chennai (MAA)", dept: "10:30", arr: "12:30", duration: "2h 00m", economyPrice: 3300, businessPrice: 8600, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 50, airline: "Air India", flightNo: "AI572", origin: "Mumbai (BOM)", dest: "Chennai (MAA)", dept: "21:00", arr: "23:00", duration: "2h 00m", economyPrice: 3600, businessPrice: 9200, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // Mumbai to Bengaluru
    { id: 51, airline: "IndiGo", flightNo: "6E345", origin: "Mumbai (BOM)", dest: "Bengaluru (BLR)", dept: "07:00", arr: "08:45", duration: "1h 45m", economyPrice: 3600, businessPrice: 9400, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 52, airline: "Air India", flightNo: "AI501", origin: "Mumbai (BOM)", dest: "Bengaluru (BLR)", dept: "14:30", arr: "16:15", duration: "1h 45m", economyPrice: 3900, businessPrice: 10200, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    { id: 53, airline: "Vistara", flightNo: "UK941", origin: "Mumbai (BOM)", dest: "Bengaluru (BLR)", dept: "19:00", arr: "20:45", duration: "1h 45m", economyPrice: 4200, businessPrice: 11000, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    
    // Mumbai to Goa
    { id: 54, airline: "IndiGo", flightNo: "6E678", origin: "Mumbai (BOM)", dest: "Goa (GOI)", dept: "08:30", arr: "09:45", duration: "1h 15m", economyPrice: 3200, businessPrice: 8400, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 55, airline: "SpiceJet", flightNo: "SG901", origin: "Mumbai (BOM)", dest: "Goa (GOI)", dept: "15:30", arr: "16:45", duration: "1h 15m", economyPrice: 3500, businessPrice: 9200, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737" },
    
    // Mumbai to Ahmedabad
    { id: 56, airline: "IndiGo", flightNo: "6E456", origin: "Mumbai (BOM)", dest: "Ahmedabad (AMD)", dept: "09:00", arr: "10:15", duration: "1h 15m", economyPrice: 2900, businessPrice: 7500, category: "domestic", stops: "Non-stop", aircraft: "ATR 72" },
    { id: 57, airline: "Air India", flightNo: "AI631", origin: "Mumbai (BOM)", dest: "Ahmedabad (AMD)", dept: "17:00", arr: "18:15", duration: "1h 15m", economyPrice: 3200, businessPrice: 8300, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // Mumbai to Pune
    { id: 58, airline: "IndiGo", flightNo: "6E789", origin: "Mumbai (BOM)", dest: "Pune (PNQ)", dept: "11:30", arr: "12:15", duration: "0h 45m", economyPrice: 1500, businessPrice: 3800, category: "domestic", stops: "Non-stop", aircraft: "ATR 72" },
    { id: 59, airline: "SpiceJet", flightNo: "SG234", origin: "Mumbai (BOM)", dest: "Pune (PNQ)", dept: "18:00", arr: "18:45", duration: "0h 45m", economyPrice: 1700, businessPrice: 4200, category: "domestic", stops: "Non-stop", aircraft: "Bombardier Q400" },
    
    // Mumbai to Hyderabad
    { id: 60, airline: "IndiGo", flightNo: "6E567", origin: "Mumbai (BOM)", dest: "Hyderabad (HYD)", dept: "12:00", arr: "13:30", duration: "1h 30m", economyPrice: 3400, businessPrice: 8800, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 61, airline: "Air India", flightNo: "AI633", origin: "Mumbai (BOM)", dest: "Hyderabad (HYD)", dept: "20:00", arr: "21:30", duration: "1h 30m", economyPrice: 3700, businessPrice: 9600, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // ========== BENGALURU (BLR) TO ALL CITIES ==========
    // Bengaluru to Delhi
    { id: 62, airline: "IndiGo", flightNo: "6E568", origin: "Bengaluru (BLR)", dest: "Delhi (DEL)", dept: "06:00", arr: "08:45", duration: "2h 45m", economyPrice: 4900, businessPrice: 12800, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 63, airline: "Air India", flightNo: "AI803", origin: "Bengaluru (BLR)", dest: "Delhi (DEL)", dept: "13:30", arr: "16:15", duration: "2h 45m", economyPrice: 5300, businessPrice: 13800, category: "domestic", stops: "Non-stop", aircraft: "Airbus A321" },
    
    // Bengaluru to Mumbai
    { id: 64, airline: "IndiGo", flightNo: "6E346", origin: "Bengaluru (BLR)", dest: "Mumbai (BOM)", dept: "09:30", arr: "11:15", duration: "1h 45m", economyPrice: 3700, businessPrice: 9700, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 65, airline: "Air India", flightNo: "AI502", origin: "Bengaluru (BLR)", dest: "Mumbai (BOM)", dept: "17:00", arr: "18:45", duration: "1h 45m", economyPrice: 4000, businessPrice: 10500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // Bengaluru to Chennai
    { id: 66, airline: "IndiGo", flightNo: "6E457", origin: "Bengaluru (BLR)", dest: "Chennai (MAA)", dept: "08:00", arr: "09:00", duration: "1h 00m", economyPrice: 1900, businessPrice: 4900, category: "domestic", stops: "Non-stop", aircraft: "ATR 72" },
    { id: 67, airline: "Air India", flightNo: "AI503", origin: "Bengaluru (BLR)", dest: "Chennai (MAA)", dept: "15:00", arr: "16:00", duration: "1h 00m", economyPrice: 2300, businessPrice: 5900, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // Bengaluru to Hyderabad
    { id: 68, airline: "IndiGo", flightNo: "6E891", origin: "Bengaluru (BLR)", dest: "Hyderabad (HYD)", dept: "11:00", arr: "12:00", duration: "1h 00m", economyPrice: 2600, businessPrice: 6800, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 69, airline: "SpiceJet", flightNo: "SG456", origin: "Bengaluru (BLR)", dest: "Hyderabad (HYD)", dept: "18:30", arr: "19:30", duration: "1h 00m", economyPrice: 2800, businessPrice: 7200, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737" },
    
    // Bengaluru to Kochi
    { id: 70, airline: "IndiGo", flightNo: "6E123", origin: "Bengaluru (BLR)", dest: "Kochi (COK)", dept: "10:00", arr: "11:15", duration: "1h 15m", economyPrice: 2400, businessPrice: 6200, category: "domestic", stops: "Non-stop", aircraft: "ATR 72" },
    { id: 71, airline: "Air India", flightNo: "AI603", origin: "Bengaluru (BLR)", dest: "Kochi (COK)", dept: "16:30", arr: "17:45", duration: "1h 15m", economyPrice: 2700, businessPrice: 7000, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // ========== KOLKATA (CCU) TO ALL CITIES ==========
    // Kolkata to Delhi
    { id: 72, airline: "IndiGo", flightNo: "6E235", origin: "Kolkata (CCU)", dest: "Delhi (DEL)", dept: "07:30", arr: "09:45", duration: "2h 15m", economyPrice: 4400, businessPrice: 11500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 73, airline: "Air India", flightNo: "AI704", origin: "Kolkata (CCU)", dest: "Delhi (DEL)", dept: "14:00", arr: "16:15", duration: "2h 15m", economyPrice: 4700, businessPrice: 12300, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // Kolkata to Mumbai
    { id: 74, airline: "IndiGo", flightNo: "6E679", origin: "Kolkata (CCU)", dest: "Mumbai (BOM)", dept: "09:00", arr: "11:45", duration: "2h 45m", economyPrice: 5200, businessPrice: 13500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 75, airline: "Air India", flightNo: "AI773", origin: "Kolkata (CCU)", dest: "Mumbai (BOM)", dept: "17:30", arr: "20:15", duration: "2h 45m", economyPrice: 5500, businessPrice: 14200, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // ========== HYDERABAD (HYD) TO ALL CITIES ==========
    // Hyderabad to Delhi
    { id: 76, airline: "IndiGo", flightNo: "6E457", origin: "Hyderabad (HYD)", dest: "Delhi (DEL)", dept: "08:00", arr: "10:15", duration: "2h 15m", economyPrice: 4500, businessPrice: 11800, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 77, airline: "Air India", flightNo: "AI776", origin: "Hyderabad (HYD)", dest: "Delhi (DEL)", dept: "15:30", arr: "17:45", duration: "2h 15m", economyPrice: 4800, businessPrice: 12500, category: "domestic", stops: "Non-stop", aircraft: "Airbus A319" },
    
    // Hyderabad to Chennai
    { id: 78, airline: "IndiGo", flightNo: "6E235", origin: "Hyderabad (HYD)", dest: "Chennai (MAA)", dept: "10:00", arr: "11:15", duration: "1h 15m", economyPrice: 2600, businessPrice: 6800, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 79, airline: "SpiceJet", flightNo: "SG346", origin: "Hyderabad (HYD)", dest: "Chennai (MAA)", dept: "17:00", arr: "18:15", duration: "1h 15m", economyPrice: 2800, businessPrice: 7200, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737" },
    
    // ========== GOA (GOI) TO ALL CITIES ==========
    // Goa to Delhi
    { id: 80, airline: "IndiGo", flightNo: "6E790", origin: "Goa (GOI)", dest: "Delhi (DEL)", dept: "11:00", arr: "13:45", duration: "2h 45m", economyPrice: 5700, businessPrice: 14800, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 81, airline: "SpiceJet", flightNo: "SG235", origin: "Goa (GOI)", dest: "Delhi (DEL)", dept: "16:30", arr: "19:15", duration: "2h 45m", economyPrice: 5900, businessPrice: 15300, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737" },
    
    // Goa to Mumbai
    { id: 82, airline: "IndiGo", flightNo: "6E679", origin: "Goa (GOI)", dest: "Mumbai (BOM)", dept: "10:00", arr: "11:15", duration: "1h 15m", economyPrice: 3300, businessPrice: 8600, category: "domestic", stops: "Non-stop", aircraft: "Airbus A320" },
    { id: 83, airline: "SpiceJet", flightNo: "SG902", origin: "Goa (GOI)", dest: "Mumbai (BOM)", dept: "17:00", arr: "18:15", duration: "1h 15m", economyPrice: 3600, businessPrice: 9400, category: "domestic", stops: "Non-stop", aircraft: "Boeing 737" },
    
    // ========== JAIPUR (JAI) TO ALL CITIES ==========
    // Jaipur to Delhi
    { id: 84, airline: "IndiGo", flightNo: "6E124", origin: "Jaipur (JAI)", dest: "Delhi (DEL)", dept: "09:30", arr: "10:30", duration: "1h 00m", economyPrice: 2400, businessPrice: 6200, category: "domestic", stops: "Non-stop", aircraft: "ATR 72" },
    { id: 85, airline: "SpiceJet", flightNo: "SG346", origin: "Jaipur (JAI)", dest: "Delhi (DEL)", dept: "14:00", arr: "15:00", duration: "1h 00m", economyPrice: 2600, businessPrice: 6800, category: "domestic", stops: "Non-stop", aircraft: "Bombardier Q400" },
    
    // ========== INTERNATIONAL FLIGHTS ==========
    // Chennai to International
    { id: 86, airline: "Emirates", flightNo: "EK543", origin: "Chennai (MAA)", dest: "Dubai (DXB)", dept: "04:30", arr: "07:00", duration: "4h 30m", economyPrice: 18500, businessPrice: 52000, category: "international", stops: "Non-stop", aircraft: "Boeing 777" },
    { id: 87, airline: "Singapore Airlines", flightNo: "SQ421", origin: "Chennai (MAA)", dest: "Singapore (SIN)", dept: "23:15", arr: "06:30+1", duration: "4h 45m", economyPrice: 22000, businessPrice: 68000, category: "international", stops: "Non-stop", aircraft: "Airbus A350" },
    { id: 88, airline: "Qatar Airways", flightNo: "QR529", origin: "Chennai (MAA)", dest: "Doha (DOH)", dept: "03:45", arr: "06:00", duration: "4h 15m", economyPrice: 19900, businessPrice: 55000, category: "international", stops: "Non-stop", aircraft: "Boeing 787" },
    { id: 89, airline: "Thai Airways", flightNo: "TG332", origin: "Chennai (MAA)", dest: "Bangkok (BKK)", dept: "01:00", arr: "05:30", duration: "3h 30m", economyPrice: 15500, businessPrice: 42000, category: "international", stops: "Non-stop", aircraft: "Airbus A330" },
    { id: 90, airline: "Air Asia", flightNo: "AK012", origin: "Chennai (MAA)", dest: "Kuala Lumpur (KUL)", dept: "11:45", arr: "16:30", duration: "3h 45m", economyPrice: 12500, businessPrice: 35000, category: "international", stops: "Non-stop", aircraft: "Airbus A320" },
    
    // Delhi to International
    { id: 91, airline: "British Airways", flightNo: "BA036", origin: "Delhi (DEL)", dest: "London (LHR)", dept: "13:00", arr: "18:30", duration: "9h 30m", economyPrice: 65000, businessPrice: 185000, category: "international", stops: "Non-stop", aircraft: "Boeing 787" },
    { id: 92, airline: "Air France", flightNo: "AF225", origin: "Delhi (DEL)", dest: "Paris (CDG)", dept: "09:30", arr: "14:00", duration: "8h 30m", economyPrice: 58000, businessPrice: 165000, category: "international", stops: "Non-stop", aircraft: "Airbus A350" },
    { id: 93, airline: "Emirates", flightNo: "EK515", origin: "Delhi (DEL)", dest: "Dubai (DXB)", dept: "10:30", arr: "12:30", duration: "3h 30m", economyPrice: 19500, businessPrice: 54000, category: "international", stops: "Non-stop", aircraft: "Boeing 777" },
    { id: 94, airline: "Singapore Airlines", flightNo: "SQ401", origin: "Delhi (DEL)", dest: "Singapore (SIN)", dept: "21:00", arr: "05:30+1", duration: "5h 30m", economyPrice: 25000, businessPrice: 72000, category: "international", stops: "Non-stop", aircraft: "Airbus A380" },
    { id: 95, airline: "Qatar Airways", flightNo: "QR579", origin: "Delhi (DEL)", dest: "Doha (DOH)", dept: "20:00", arr: "22:00", duration: "3h 30m", economyPrice: 21000, businessPrice: 58000, category: "international", stops: "Non-stop", aircraft: "Boeing 787" },
    
    // Mumbai to International
    { id: 96, airline: "Emirates", flightNo: "EK501", origin: "Mumbai (BOM)", dest: "Dubai (DXB)", dept: "07:00", arr: "08:30", duration: "3h 00m", economyPrice: 17500, businessPrice: 49000, category: "international", stops: "Non-stop", aircraft: "Boeing 777" },
    { id: 97, airline: "Singapore Airlines", flightNo: "SQ423", origin: "Mumbai (BOM)", dest: "Singapore (SIN)", dept: "12:00", arr: "20:00", duration: "5h 30m", economyPrice: 23500, businessPrice: 67000, category: "international", stops: "Non-stop", aircraft: "Airbus A350" },
    { id: 98, airline: "British Airways", flightNo: "BA134", origin: "Mumbai (BOM)", dest: "London (LHR)", dept: "05:30", arr: "10:30", duration: "9h 30m", economyPrice: 62000, businessPrice: 178000, category: "international", stops: "Non-stop", aircraft: "Boeing 777" },
    
    // Bengaluru to International
    { id: 99, airline: "Emirates", flightNo: "EK563", origin: "Bengaluru (BLR)", dest: "Dubai (DXB)", dept: "09:30", arr: "12:00", duration: "3h 30m", economyPrice: 18900, businessPrice: 53000, category: "international", stops: "Non-stop", aircraft: "Boeing 777" },
    { id: 100, airline: "Singapore Airlines", flightNo: "SQ505", origin: "Bengaluru (BLR)", dest: "Singapore (SIN)", dept: "23:00", arr: "06:00+1", duration: "4h 30m", economyPrice: 21500, businessPrice: 62000, category: "international", stops: "Non-stop", aircraft: "Airbus A350" }
];

let currentFlights = [...allFlights];
let currentFilter = "all";
let expandedFlightId = null;
let selectedFare = {};

// DOM Elements
const flightGrid = document.getElementById("flightGrid");
const originInput = document.getElementById("origin");
const destInput = document.getElementById("destination");
const searchBtn = document.getElementById("searchFlightsBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

// Helper to extract city code
function extractCityCode(input) {
    const match = input.match(/\(([^)]+)\)/);
    return match ? match[1] : input;
}

// Search Flights - FIXED to work for all city pairs
function searchFlights() {
    let origin = originInput.value.toLowerCase().trim();
    let dest = destInput.value.toLowerCase().trim();
    
    // Extract city names without airport codes for better matching
    const originCity = origin.split('(')[0].trim();
    const destCity = dest.split('(')[0].trim();
    const originCode = extractCityCode(origin);
    const destCode = extractCityCode(dest);
    
    let filtered = allFlights.filter(flight => {
        const flightOriginLower = flight.origin.toLowerCase();
        const flightDestLower = flight.dest.toLowerCase();
        
        // Match by city name or airport code
        const originMatch = flightOriginLower.includes(origin) || 
                           flightOriginLower.includes(originCity) ||
                           flightOriginLower.includes(originCode) ||
                           origin.includes(flightOriginLower.split('(')[0].trim()) ||
                           originCode === flight.origin.split('(')[1]?.replace(')', '');
        
        const destMatch = flightDestLower.includes(dest) || 
                          flightDestLower.includes(destCity) ||
                          flightDestLower.includes(destCode) ||
                          dest.includes(flightDestLower.split('(')[0].trim()) ||
                          destCode === flight.dest.split('(')[1]?.replace(')', '');
        
        const catMatch = currentFilter === "all" || flight.category === currentFilter;
        
        return originMatch && destMatch && catMatch;
    });
    
    currentFlights = filtered;
    renderFlights();
}

// Toggle Details
function toggleDetails(flightId) {
    const expandDiv = document.getElementById(`expand-${flightId}`);
    const btn = document.querySelector(`.view-details-btn[data-id="${flightId}"]`);
    
    if (expandedFlightId === flightId) {
        expandDiv.classList.remove("show");
        btn.innerHTML = '<i class="fas fa-chevron-down"></i> View Details';
        expandedFlightId = null;
    } else {
        if (expandedFlightId) {
            const prevExpand = document.getElementById(`expand-${expandedFlightId}`);
            const prevBtn = document.querySelector(`.view-details-btn[data-id="${expandedFlightId}"]`);
            if (prevExpand) prevExpand.classList.remove("show");
            if (prevBtn) prevBtn.innerHTML = '<i class="fas fa-chevron-down"></i> View Details';
        }
        expandDiv.classList.add("show");
        btn.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Details';
        expandedFlightId = flightId;
    }
}

// Select Fare
function selectFare(flightId, fareClass, price) {
    selectedFare[flightId] = { class: fareClass, price: price };
    
    document.querySelectorAll(`.fare-card[data-flight="${flightId}"]`).forEach(card => {
        card.classList.remove("selected");
    });
    const selectedCard = document.querySelector(`.fare-card[data-class="${fareClass}"][data-flight="${flightId}"]`);
    if (selectedCard) selectedCard.classList.add("selected");
    
    const priceSpan = document.querySelector(`.flight-card[data-id="${flightId}"] .price-amount`);
    if (priceSpan) priceSpan.innerHTML = `₹${price.toLocaleString()}`;
}

// Proceed to Booking
function proceedToBook(flightId, flight, fareClass, price) {
    const passengers = parseInt(document.getElementById("passengers").value) || 1;
    const travelDate = document.getElementById("travelDate").value;
    const from = originInput.value;
    const to = destInput.value;
    
    const bookingInfo = {
        flight: flight,
        selectedClass: fareClass,
        totalPrice: price,
        passengers: passengers,
        travelDate: travelDate,
        from: from,
        to: to
    };
    localStorage.setItem("selectedFlight", JSON.stringify(bookingInfo));
    window.location.href = "passenger_details.html";
}

// Render Flights
function renderFlights() {
    if (!flightGrid) return;
    
    if (currentFlights.length === 0) {
        flightGrid.innerHTML = `<div style="text-align:center; padding:2rem; background:white; border-radius:28px;">
            <i class="fas fa-plane-slash" style="font-size:2rem; color:#cbd5e1; margin-bottom:1rem; display:block;"></i>
            <h3 style="color:#1e293b; margin-bottom:0.5rem;">No flights found</h3>
            <p style="color:#64748b;">Try changing your search criteria or selecting different cities.</p>
            <p style="color:#94a3b8; font-size:0.8rem; margin-top:0.5rem;">Available routes: Chennai, Delhi, Mumbai, Bengaluru, Kolkata, Hyderabad, Goa, Jaipur, etc.</p>
        </div>`;
        return;
    }
    
    flightGrid.innerHTML = currentFlights.map(flight => `
        <div class="flight-card" data-id="${flight.id}">
            <div class="flight-main">
                <div class="flight-route">
                    <div class="airline-logo">
                        <i class="fas fa-plane"></i>
                    </div>
                    <div class="route-details">
                        <div class="route-city">
                            <span class="origin">${flight.origin}</span>
                            <i class="fas fa-arrow-right arrow"></i>
                            <span class="destination">${flight.dest}</span>
                        </div>
                        <div class="time-details">
                            <span>${flight.dept} → ${flight.arr}</span>
                            <span>• ${flight.duration}</span>
                        </div>
                    </div>
                </div>
                <div class="flight-meta">
                    <span class="meta-item"><i class="fas fa-plane"></i> ${flight.airline}</span>
                    <span class="meta-item"><i class="fas fa-tag"></i> ${flight.flightNo}</span>
                    <span class="meta-item"><i class="fas fa-chair"></i> ${flight.stops}</span>
                    <span class="meta-item"><i class="fas fa-globe"></i> ${flight.category === "domestic" ? "Domestic" : "International"}</span>
                </div>
                <div class="flight-price">
                    <div class="price-amount">₹${flight.economyPrice.toLocaleString()}</div>
                    <div class="price-label">Economy starting from</div>
                </div>
                <button class="view-details-btn" data-id="${flight.id}">
                    <i class="fas fa-chevron-down"></i> View Details
                </button>
            </div>
            <div class="flight-details-expand" id="expand-${flight.id}">
                <div class="details-content">
                    <div class="flight-info-detail">
                        <div class="detail-row"><span class="detail-label">Aircraft:</span><span class="detail-value">${flight.aircraft}</span></div>
                        <div class="detail-row"><span class="detail-label">Flight Duration:</span><span class="detail-value">${flight.duration}</span></div>
                        <div class="detail-row"><span class="detail-label">Stops:</span><span class="detail-value">${flight.stops}</span></div>
                    </div>
                    <div class="fare-options">
                        <div class="fare-card ${selectedFare[flight.id]?.class === 'economy' ? 'selected' : ''}" data-class="economy" data-flight="${flight.id}" data-price="${flight.economyPrice}">
                            <div class="fare-name">Economy Class</div>
                            <div class="fare-price">₹${flight.economyPrice.toLocaleString()}</div>
                            <div class="fare-features"><i class="fas fa-check-circle"></i> 7kg Cabin Baggage</div>
                            <div class="fare-features"><i class="fas fa-check-circle"></i> 15kg Check-in</div>
                            <div class="fare-features"><i class="fas fa-times-circle"></i> Meal not included</div>
                            <div class="fare-features"><i class="fas fa-chair"></i> Standard Seating</div>
                        </div>
                        <div class="fare-card ${selectedFare[flight.id]?.class === 'business' ? 'selected' : ''}" data-class="business" data-flight="${flight.id}" data-price="${flight.businessPrice}">
                            <div class="fare-name">Business Class</div>
                            <div class="fare-price">₹${flight.businessPrice.toLocaleString()}</div>
                            <div class="fare-features"><i class="fas fa-check-circle"></i> 10kg Cabin Baggage</div>
                            <div class="fare-features"><i class="fas fa-check-circle"></i> 25kg Check-in</div>
                            <div class="fare-features"><i class="fas fa-utensils"></i> Complimentary Meal</div>
                            <div class="fare-features"><i class="fas fa-star"></i> Extra Legroom</div>
                        </div>
                    </div>
                    <button class="select-fare-btn" data-flight='${JSON.stringify(flight)}'>Continue to Booking →</button>
                </div>
            </div>
        </div>
    `).join("");
    
    // Attach event listeners
    document.querySelectorAll(".view-details-btn").forEach(btn => {
        btn.addEventListener("click", () => toggleDetails(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll(".fare-card").forEach(card => {
        card.addEventListener("click", (e) => {
            e.stopPropagation();
            const flightId = parseInt(card.dataset.flight);
            const fareClass = card.dataset.class;
            const price = parseInt(card.dataset.price);
            selectFare(flightId, fareClass, price);
        });
    });
    
    document.querySelectorAll(".select-fare-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const flight = JSON.parse(btn.dataset.flight);
            const selected = selectedFare[flight.id];
            const fareClass = selected ? selected.class : "economy";
            const price = selected ? selected.price : flight.economyPrice;
            proceedToBook(flight.id, flight, fareClass, price);
        });
    });
}

// Category Filter
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        searchFlights();
    });
});

// Search Event
if (searchBtn) {
    searchBtn.addEventListener("click", searchFlights);
}

// Enter key support
if (originInput) {
    originInput.addEventListener("keypress", (e) => { if (e.key === "Enter") searchFlights(); });
}
if (destInput) {
    destInput.addEventListener("keypress", (e) => { if (e.key === "Enter") searchFlights(); });
}

// Smooth scrolling
const homeNav = document.getElementById("homeNav");
const passengerDetailsNav = document.getElementById("passengerDetailsNav");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const helpButton = document.getElementById("helpButton");
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (homeNav) {
    homeNav.addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
}
if (passengerDetailsNav) {
    passengerDetailsNav.addEventListener("click", (e) => { e.preventDefault(); window.location.href = "passenger_details.html"; });
}
if (loginBtn) {
    loginBtn.addEventListener("click", () => alert("Login functionality (to be connected with backend)"));
}
if (signupBtn) {
    signupBtn.addEventListener("click", () => alert("Sign Up functionality (to be connected with backend)"));
}
if (helpButton) {
    helpButton.addEventListener("click", () => {
        alert("Need help? Call +91 9876543210 or email support@bluesky.com");
    });
}
if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) scrollTopBtn.classList.add("visible");
        else scrollTopBtn.classList.remove("visible");
    });
    scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Initial render
searchFlights();
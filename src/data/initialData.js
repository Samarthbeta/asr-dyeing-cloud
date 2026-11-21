export const INITIAL_DATA = {
  company: {
    id: 1,
    name: "MOHINDER DYEING & FINISHING HOUSE",
    unit: "Unit 1: ASR Dyeing Solutions",
    address: "B-31, 2219/2B/25, Mahavir Colony, Near Makkar Text, Tajpur Road, Kakka Road",
    city: "Ludhiana",
    state: "Punjab",
    pin: "141008",
    gstin: "03ACDFM5024D1ZV",
    stateCode: "03",
    phone: "+91 98765-43210",
    email: "info@asrdyeing.com",
    serviceHsn: "998821" // Textile finishing and dyeing job work
  },

  parties: [
    {
      id: 101,
      code: "ACC-001",
      name: "Oswal Woollen Mills Ltd",
      contactPerson: "Mr. R.K. Sharma",
      phone: "+91 98140-11223",
      city: "Ludhiana",
      state: "Punjab",
      gstin: "03AAACT1234F1Z5",
      type: "Customer",
      balance: 145000
    },
    {
      id: 102,
      code: "ACC-002",
      name: "Vardhman Textiles & Knits",
      contactPerson: "Mr. Sandeep Gupta",
      phone: "+91 98141-99887",
      city: "Ludhiana",
      state: "Punjab",
      gstin: "03AABCV5678B1Z9",
      type: "Customer",
      balance: 88500
    },
    {
      id: 103,
      code: "ACC-003",
      name: "Monte Carlo Fashions Ltd",
      contactPerson: "Mr. Anil Mehta",
      phone: "+91 98722-33445",
      city: "Ludhiana",
      state: "Punjab",
      gstin: "03AACCM9911K1Z2",
      type: "Customer",
      balance: 210000
    },
    {
      id: 104,
      code: "ACC-004",
      name: "Kudu Knit Processors",
      contactPerson: "Mr. Jasbir Singh",
      phone: "+91 98888-44556",
      city: "Ludhiana",
      state: "Punjab",
      gstin: "03AADCK3322P1Z1",
      type: "Customer",
      balance: 45000
    },
    {
      id: 201,
      code: "VEN-001",
      name: "Colourtex Industries Chemicals",
      contactPerson: "Rajeev Bansal",
      phone: "+91 98250-77665",
      city: "Surat",
      state: "Gujarat",
      gstin: "24AACCC5544R1Z0",
      type: "Vendor",
      balance: -320000
    }
  ],

  items: [
    // Group 1: Fabrics (Customer Non-owned)
    { id: 1, name: "100% Cotton Single Jersey (180 GSM)", code: "FAB-SJ180", group: "Fabric", groupId: 1, unit: "KG", hsn: "6006" },
    { id: 2, name: "Cotton Lycra 95/5 (210 GSM)", code: "FAB-CL210", group: "Fabric", groupId: 1, unit: "KG", hsn: "6004" },
    { id: 3, name: "3-Thread Fleece Cotton/Poly (320 GSM)", code: "FAB-FL320", group: "Fabric", groupId: 1, unit: "KG", hsn: "6006" },
    { id: 4, name: "2x2 Rib Knitted Fabric (220 GSM)", code: "FAB-RIB220", group: "Fabric", groupId: 1, unit: "KG", hsn: "6006" },
    { id: 5, name: "French Terry Loop Knit (240 GSM)", code: "FAB-FT240", group: "Fabric", groupId: 1, unit: "KG", hsn: "6006" },
    
    // Group 5: Dyes (Owned Stock)
    { id: 11, name: "Reactive Black B 133%", code: "DYE-BLK-B", group: "Dye", groupId: 5, unit: "KG", costPerKg: 380, stock: 450 },
    { id: 12, name: "Reactive Navy Blue RGB", code: "DYE-NAVY-RGB", group: "Dye", groupId: 5, unit: "KG", costPerKg: 420, stock: 320 },
    { id: 13, name: "Reactive Red HE8B", code: "DYE-RED-HE8B", group: "Dye", groupId: 5, unit: "KG", costPerKg: 490, stock: 180 },
    { id: 14, name: "Reactive Golden Yellow R", code: "DYE-YEL-R", group: "Dye", groupId: 5, unit: "KG", costPerKg: 360, stock: 240 },
    { id: 15, name: "Disperse Blue 2BLN", code: "DYE-DISP-BLU", group: "Dye", groupId: 5, unit: "KG", costPerKg: 310, stock: 150 },

    // Group 6 & 10: Chemicals & Auxiliaries (Owned Stock)
    { id: 21, name: "Glauber's Salt (Sodium Sulphate)", code: "CHM-GLAUB-SALT", group: "Chemical", groupId: 6, unit: "KG", costPerKg: 16, stock: 4200 },
    { id: 22, name: "Soda Ash (Sodium Carbonate)", code: "CHM-SODA-ASH", group: "Chemical", groupId: 6, unit: "KG", costPerKg: 34, stock: 1800 },
    { id: 23, name: "Acetic Acid 99% Pure", code: "CHM-ACETIC-ACID", group: "Chemical", groupId: 6, unit: "KG", costPerKg: 68, stock: 650 },
    { id: 24, name: "Hydrogen Peroxide 50%", code: "CHM-H2O2-50", group: "Chemical", groupId: 6, unit: "KG", costPerKg: 48, stock: 920 },
    { id: 25, name: "Caustic Soda Flakes", code: "CHM-CAUSTIC-SODA", group: "Chemical", groupId: 6, unit: "KG", costPerKg: 52, stock: 1400 },
    { id: 26, name: "Low Foaming Wetting Agent LF", code: "AUX-WET-LF", group: "Auxiliary", groupId: 10, unit: "KG", costPerKg: 110, stock: 280 },
    { id: 27, name: "High-Temp Soaping Agent", code: "AUX-SOAP-HT", group: "Auxiliary", groupId: 10, unit: "KG", costPerKg: 145, stock: 310 },
    { id: 28, name: "Silicone Softener Emulsion", code: "AUX-SIL-SOFT", group: "Auxiliary", groupId: 10, unit: "KG", costPerKg: 165, stock: 420 }
  ],

  machines: [
    { id: 1, code: "SF-01", name: "Soft Flow Dyeing Vessel 1", type: "Soft Flow", capacityKg: 400, liquorRatio: 6, status: "Dyeing", currentBatch: "JC-2026-0041" },
    { id: 2, code: "SF-02", name: "Soft Flow Dyeing Vessel 2", type: "Soft Flow", capacityKg: 600, liquorRatio: 6, status: "Idle", currentBatch: null },
    { id: 3, code: "SF-03", name: "Soft Flow Dyeing Vessel 3", type: "Soft Flow", capacityKg: 400, liquorRatio: 6, status: "Washing", currentBatch: "JC-2026-0042" },
    { id: 4, code: "JET-01", name: "High Temp High Pressure Jet", type: "HTHP Jet", capacityKg: 250, liquorRatio: 8, status: "Idle", currentBatch: null },
    { id: 5, code: "JIG-01", name: "Automatic Open Jigger", type: "Jigger", capacityKg: 300, liquorRatio: 5, status: "Idle", currentBatch: null },
    { id: 6, code: "ST-01", name: "8-Chamber Gas Stenter", type: "Stenter", capacityKg: 1000, liquorRatio: 1, status: "Running", currentBatch: null },
    { id: 7, code: "TC-01", name: "Tubular Compactor Machine", type: "Compactor", capacityKg: 800, liquorRatio: 1, status: "Running", currentBatch: null }
  ],

  shades: [
    { id: 1, code: "SH-001", name: "Jet Black (Extra Dark)", depth: "Extra Dark", depthVal: 4, recipeId: 1001 },
    { id: 2, code: "SH-002", name: "Royal Navy Blue", depth: "Dark", depthVal: 3, recipeId: 1002 },
    { id: 3, code: "SH-003", name: "Olive Green Military", depth: "Medium", depthVal: 2, recipeId: 1003 },
    { id: 4, code: "SH-004", name: "Crimson Maroon", depth: "Dark", depthVal: 3, recipeId: 1004 },
    { id: 5, code: "SH-005", name: "Dusty Peach / Rose", depth: "Light", depthVal: 1, recipeId: 1005 },
    { id: 6, code: "SH-006", name: "Bleach White / Optical", depth: "Light", depthVal: 1, recipeId: 1006 }
  ],

  standardRecipes: [
    {
      id: 1001,
      shadeName: "Jet Black (Extra Dark)",
      depth: "Extra Dark",
      liquorRatioDefault: 6,
      dyes: [
        { itemId: 11, name: "Reactive Black B 133%", dosagePercent: 4.80 }
      ],
      chemicals: [
        { itemId: 21, name: "Glauber's Salt (Sodium Sulphate)", gpl: 80 },
        { itemId: 22, name: "Soda Ash (Sodium Carbonate)", gpl: 20 },
        { itemId: 26, name: "Low Foaming Wetting Agent LF", gpl: 1.5 },
        { itemId: 27, name: "High-Temp Soaping Agent", gpl: 2.0 },
        { itemId: 23, name: "Acetic Acid 99% Pure", gpl: 1.0 }
      ]
    },
    {
      id: 1002,
      shadeName: "Royal Navy Blue",
      depth: "Dark",
      liquorRatioDefault: 6,
      dyes: [
        { itemId: 12, name: "Reactive Navy Blue RGB", dosagePercent: 3.20 },
        { itemId: 13, name: "Reactive Red HE8B", dosagePercent: 0.35 }
      ],
      chemicals: [
        { itemId: 21, name: "Glauber's Salt (Sodium Sulphate)", gpl: 60 },
        { itemId: 22, name: "Soda Ash (Sodium Carbonate)", gpl: 18 },
        { itemId: 26, name: "Low Foaming Wetting Agent LF", gpl: 1.5 },
        { itemId: 27, name: "High-Temp Soaping Agent", gpl: 1.8 }
      ]
    },
    {
      id: 1003,
      shadeName: "Olive Green Military",
      depth: "Medium",
      liquorRatioDefault: 6,
      dyes: [
        { itemId: 14, name: "Reactive Golden Yellow R", dosagePercent: 1.45 },
        { itemId: 12, name: "Reactive Navy Blue RGB", dosagePercent: 0.65 },
        { itemId: 11, name: "Reactive Black B 133%", dosagePercent: 0.15 }
      ],
      chemicals: [
        { itemId: 21, name: "Glauber's Salt (Sodium Sulphate)", gpl: 45 },
        { itemId: 22, name: "Soda Ash (Sodium Carbonate)", gpl: 15 },
        { itemId: 26, name: "Low Foaming Wetting Agent LF", gpl: 1.5 }
      ]
    }
  ],

  // IGR: Inward Grey Receipts (Raw Fabric received from customers for Job Work)
  igrs: [
    {
      id: 501,
      igrNo: "IGR-2026-0811",
      date: "2026-11-20",
      partyId: 101,
      partyName: "Oswal Woollen Mills Ltd",
      partyChallanNo: "CH-OWM-9912",
      partyChallanDate: "2026-11-19",
      vehicleNo: "PB-10-DF-4819",
      totalQty: 840.50,
      totalRolls: 38,
      status: "In Process",
      lots: [
        {
          lotNo: "LOT-26-8801",
          itemId: 1,
          itemName: "100% Cotton Single Jersey (180 GSM)",
          rolls: 18,
          weightKg: 402.50,
          shadeId: 1,
          shadeName: "Jet Black (Extra Dark)",
          depth: "Extra Dark",
          status: "Dyeing",
          processes: ["Bio-wash", "Dyeing", "Hydro", "Stenter", "Compacting"]
        },
        {
          lotNo: "LOT-26-8802",
          itemId: 2,
          itemName: "Cotton Lycra 95/5 (210 GSM)",
          rolls: 20,
          weightKg: 438.00,
          shadeId: 2,
          shadeName: "Royal Navy Blue",
          depth: "Dark",
          status: "Batched",
          processes: ["Heat-set", "Scouring", "Dyeing", "Stenter", "Compacting"]
        }
      ]
    },
    {
      id: 502,
      igrNo: "IGR-2026-0812",
      date: "2026-11-21",
      partyId: 102,
      partyName: "Vardhman Textiles & Knits",
      partyChallanNo: "VTK-DEL-410",
      partyChallanDate: "2026-11-20",
      vehicleNo: "PB-10-EE-2204",
      totalQty: 620.00,
      totalRolls: 26,
      status: "WIP Floor",
      lots: [
        {
          lotNo: "LOT-26-8803",
          itemId: 3,
          itemName: "3-Thread Fleece Cotton/Poly (320 GSM)",
          rolls: 26,
          weightKg: 620.00,
          shadeId: 3,
          shadeName: "Olive Green Military",
          depth: "Medium",
          status: "Inward Pending",
          processes: ["Bio-wash", "Dyeing", "Raising", "Stenter"]
        }
      ]
    }
  ],

  // Job Cards: Scheduled & Executing Batches on Dyeing Vessels
  jobCards: [
    {
      id: 701,
      jcNo: "JC-2026-0041",
      date: "2026-11-20",
      machineId: 1,
      machineCode: "SF-01",
      vesselName: "Soft Flow Dyeing Vessel 1",
      lotNo: "LOT-26-8801",
      partyName: "Oswal Woollen Mills Ltd",
      fabricName: "100% Cotton Single Jersey (180 GSM)",
      batchWeightKg: 402.50,
      rolls: 18,
      shadeId: 1,
      shadeName: "Jet Black (Extra Dark)",
      depth: "Extra Dark",
      liquorRatio: 6,
      waterBathLiters: 2415, // 402.5 * 6
      status: "In Dyeing",
      startTime: "14:30",
      chemicalCost: 4520.50,
      costPerKg: 11.23,
      chemicalsDosed: [
        { name: "Reactive Black B 133%", formula: "% o.w.f.", dosage: "4.80%", requiredKg: 19.32, unitCost: 380, cost: 7341.60 },
        { name: "Glauber's Salt", formula: "g/L bath", dosage: "80 g/L", requiredKg: 193.20, unitCost: 16, cost: 3091.20 },
        { name: "Soda Ash", formula: "g/L bath", dosage: "20 g/L", requiredKg: 48.30, unitCost: 34, cost: 1642.20 },
        { name: "Low Foaming Wetting Agent LF", formula: "g/L bath", dosage: "1.5 g/L", requiredKg: 3.62, unitCost: 110, cost: 398.20 }
      ]
    },
    {
      id: 702,
      jcNo: "JC-2026-0042",
      date: "2026-11-21",
      machineId: 3,
      machineCode: "SF-03",
      vesselName: "Soft Flow Dyeing Vessel 3",
      lotNo: "LOT-26-8802",
      partyName: "Oswal Woollen Mills Ltd",
      fabricName: "Cotton Lycra 95/5 (210 GSM)",
      batchWeightKg: 438.00,
      rolls: 20,
      shadeId: 2,
      shadeName: "Royal Navy Blue",
      depth: "Dark",
      liquorRatio: 6,
      waterBathLiters: 2628,
      status: "Washing",
      startTime: "09:15",
      chemicalCost: 3980.00,
      costPerKg: 9.08,
      chemicalsDosed: [
        { name: "Reactive Navy Blue RGB", formula: "% o.w.f.", dosage: "3.20%", requiredKg: 14.02, unitCost: 420, cost: 5888.40 },
        { name: "Reactive Red HE8B", formula: "% o.w.f.", dosage: "0.35%", requiredKg: 1.53, unitCost: 490, cost: 749.70 },
        { name: "Glauber's Salt", formula: "g/L bath", dosage: "60 g/L", requiredKg: 157.68, unitCost: 16, cost: 2522.88 },
        { name: "Soda Ash", formula: "g/L bath", dosage: "18 g/L", requiredKg: 47.30, unitCost: 34, cost: 1608.20 }
      ]
    }
  ],

  // Dispatch Slips: Finished Goods Sent to Customer with Shrinkage Loss % Tracking
  dispatches: [
    {
      id: 901,
      dispNo: "DSP-2026-0310",
      date: "2026-11-21",
      partyId: 103,
      partyName: "Monte Carlo Fashions Ltd",
      vehicleNo: "PB-10-CX-7781",
      driverName: "Gurpreet Singh",
      lotNo: "LOT-26-8790",
      fabricName: "French Terry Loop Knit (240 GSM)",
      shadeName: "Royal Navy Blue",
      inwardWeightKg: 520.00,
      dispatchedWeightKg: 498.50,
      inwardRolls: 22,
      dispatchedRolls: 22,
      weightDiffKg: 21.50, // 520 - 498.5
      processLossPercent: 4.13, // (21.5 / 520) * 100
      status: "Normal", // Normal (3-5%), High (>6%)
      ratePerKg: 48.00,
      billAmount: 23928.00,
      gstAmount: 1196.40,
      totalAmount: 25124.40
    }
  ],

  // Outward Goods Challan (OGC / Gate Pass) for Outsourcing Stages (e.g. Raising, Peaching, Compacting)
  gatePasses: [
    {
      id: 801,
      ogcNo: "OGC-RGP-2026-0104",
      type: "RGP", // Returnable Gate Pass
      date: "2026-11-21",
      partyName: "Guru Nanak Raising Mills",
      purpose: "Fleece Inside Wire Raising Job Work",
      lotNo: "LOT-26-8803",
      fabricName: "3-Thread Fleece Cotton/Poly (320 GSM)",
      rolls: 26,
      weightKg: 620.00,
      vehicleNo: "PB-10-GA-1102",
      expectedReturnDate: "2026-11-23",
      status: "At Vendor"
    }
  ]
};

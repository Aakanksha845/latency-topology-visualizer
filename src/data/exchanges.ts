export type Exchange = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  provider: "AWS" | "GCP" | "Azure" | "Other";
  city?: string;
  region?: string;
  countryCode: string;
};

export const EXCHANGES: Exchange[] = [
  {
    id: "binance",
    name: "Binance",
    lat: 1.3521,
    lng: 103.8198,
    provider: "AWS",
    city: "Singapore",
    region: "ap-southeast-1",
    countryCode: "SG",
  },
  {
    id: "okx",
    name: "OKX",
    lat: 22.3193,
    lng: 114.1694,
    provider: "Azure",
    city: "Hong Kong",
    region: "eastasia",
    countryCode: "HK",
  },
  {
    id: "coinbase",
    name: "Coinbase",
    lat: 37.7749,
    lng: -122.4194,
    provider: "AWS",
    city: "San Francisco",
    region: "us-west-1",
    countryCode: "US",
  },
  {
    id: "kraken",
    name: "Kraken",
    lat: 47.6062,
    lng: -122.3321,
    provider: "AWS",
    city: "Seattle",
    region: "us-west-2",
    countryCode: "US",
  },
  {
    id: "bitfinex",
    name: "Bitfinex",
    lat: 25.2048,
    lng: 55.2708,
    provider: "Azure",
    city: "Dubai",
    region: "uaenorth",
    countryCode: "AE",
  },
  {
    id: "kucoin",
    name: "KuCoin",
    lat: 1.2897,
    lng: 103.8501,
    provider: "GCP",
    city: "Singapore",
    region: "asia-southeast1",
    countryCode: "SG",
  },
  {
    id: "gateio",
    name: "Gate.io",
    lat: 35.6586,
    lng: 139.7454,
    provider: "GCP",
    city: "Tokyo",
    region: "asia-northeast1",
    countryCode: "JP",
  },
];

//Servers which needs uptime robot monitors to be set up
// ,
//   {
//     id: "bybit",
//     name: "Bybit",
//     lat: 35.6762, // Tokyo - Shibuya district
//     lng: 139.6503,
//     provider: "GCP",
//     city: "Tokyo",
//     region: "asia-northeast1",
//     countryCode: "JP",
//   },
// ,
//   {
//     id: "huobi",
//     name: "Huobi",
//     lat: 22.2783, // Hong Kong - Kowloon area
//     lng: 114.1747,
//     provider: "AWS",
//     city: "Hong Kong",
//     region: "ap-east-1",
//     countryCode: "HK",
//   },
// ,
//   {
//     id: "bitstamp",
//     name: "Bitstamp",
//     lat: 51.5074, // London - City of London
//     lng: -0.1278,
//     provider: "AWS",
//     city: "London",
//     region: "eu-west-2",
//     countryCode: "GB",
//   },
//   {
//     id: "gemini",
//     name: "Gemini",
//     lat: 40.7128, // New York - Manhattan
//     lng: -74.006,
//     provider: "GCP",
//     city: "New York",
//     region: "us-east1",
//     countryCode: "US",
//   },
//   {
//     id: "deribit",
//     name: "Deribit",
//     lat: 52.3676, // Amsterdam - City Center
//     lng: 4.9041,
//     provider: "AWS",
//     city: "Amsterdam",
//     region: "eu-west-1",
//     countryCode: "NL",
//   },
// ,
// {
//   id: "bitget",
//   name: "Bitget",
//   lat: 1.2804, // Singapore - Tampines area
//   lng: 103.8448,
//   provider: "AWS",
//   city: "Singapore",
//   region: "ap-southeast-1",
//   countryCode: "SG",
// },
// {
//   id: "bitmex",
//   name: "BitMEX",
//   lat: 22.2819, // Hong Kong - Wan Chai district
//   lng: 114.1778,
//   provider: "AWS",
//   city: "Hong Kong",
//   region: "ap-east-1",
//   countryCode: "HK",
// },

import http from "k6/http";
import { sleep } from "k6";

// Test configuration
export const options = {
  vus: 2,
  duration: "1s",
  thresholds: {
    // Assert that 99% of requests finish within 3000ms.
    http_req_duration: ["p(95) < 3000"],
  },
};

// // Test USER PLAN
// export default function () {
//   const REQUESTS_PER_SECOND = 50;

//   const url = "http://localhost:3000/email"; // Replace with your API endpoint
//   const payload = {
//     sender_email: "now@scraper.fyi",
//     recipient_email: "test@gmail.com",
//     subject: "This is a test from API",
//     body: "This is a test from API",
//   };
//   const headers = {
//     "Content-Type": "application/json",
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIiLCJlbWFpbCI6ImhhYmltYW5hb2xpdmllcjZAZ21haWwuY29tIiwiaWF0IjoxNzAwNjcxMzA0fQ.l1E484nD-d0EF7TVQp2X4rmU2jOco3j4mpHNNYy9CsM",
//   };

//   const params = {
//     headers: headers,
//   };

//   for (let i = 0; i < REQUESTS_PER_SECOND; i++) {
//     http.post(url, JSON.stringify(payload), params);
//   }

//   sleep(1);
// }

// Test SYSTEM_WIDERATE_LIMITER_REQUESTS
export default function () {
  const REQUESTS_PER_SECOND = 50;

  const url = "http://localhost:3000/";

  const headers = {
    "Content-Type": "application/json",
  };

  const params = {
    headers: headers,
  };

  for (let i = 0; i < REQUESTS_PER_SECOND; i++) {
    http.get(url, params);
  }

  sleep(1);
}

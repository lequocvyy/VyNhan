const API_URL = "http://localhost:5000/api/users";

export async function fetchCustomers() {
  const res = await fetch(`${API_URL}/customers`);
  return res.json();
}
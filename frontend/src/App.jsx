
import { useEffect, useState } from "react";
import { apiRequest } from "./services/api";
import Login from "./Login";


import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Users,
  CreditCard,
  UserCog,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  ArrowUpRight,
  Clock,
  CheckCircle,
} from "lucide-react";

import "./App.css";
import "./components/AddRoom.css";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("hotel_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
const [loggingOut, setLoggingOut] = useState(false);
const [selectedPage, setSelectedPage] = useState(
  () => sessionStorage.getItem("hotel_selected_page") || "Dashboard"
);
const [dashboardData, setDashboardData] = useState(null);
const [bookings, setBookings] = useState([]);

const [loading, setLoading] = useState(true);
const [dashboardError, setDashboardError] = useState("");
const [bookingsError, setBookingsError] = useState("");

// Add these new Rooms states below
const [rooms, setRooms] = useState([]);
const [roomsLoading, setRoomsLoading] = useState(false);
const [roomsError, setRoomsError] = useState("");
const [roomMessage, setRoomMessage] = useState("");
const [showRoomForm, setShowRoomForm] = useState(false);
const [editingRoom, setEditingRoom] = useState(null);

const [customers, setCustomers] = useState([]);
const [customersLoading, setCustomersLoading] = useState(false);
const [customersError, setCustomersError] = useState("");
const [customerSearch, setCustomerSearch] = useState("");

const [payments, setPayments] = useState([]);
const [paymentsLoading, setPaymentsLoading] = useState(false);
const [paymentsError, setPaymentsError] = useState("");
const [paymentSearch, setPaymentSearch] = useState("");

const [employees, setEmployees] = useState([]);
const [employeesLoading, setEmployeesLoading] = useState(false);
const [employeesError, setEmployeesError] = useState("");
const [employeeSearch, setEmployeeSearch] = useState("");

const [reportLoading, setReportLoading] = useState(false);

const emptyRoomForm = {
  room_number: "",
  room_type: "SINGLE",
  description: "",
  price_per_night: "",
  capacity: "1",
  amenities: "",
  status: "AVAILABLE",
};

const [roomForm, setRoomForm] = useState(emptyRoomForm);
const [savingRoom, setSavingRoom] = useState(false);

const emptyEmployeeForm = {
  full_name: "",
  email: "",
  phone: "",
  position: "",
  salary: "",
  hire_date: "",
  employment_status: "ACTIVE",
  address: "",
};

const [employeeForm, setEmployeeForm] = useState(emptyEmployeeForm);
const [showEmployeeForm, setShowEmployeeForm] = useState(false);
const [savingEmployee, setSavingEmployee] = useState(false);
const [employeeMessage, setEmployeeMessage] = useState("");

  // Fetch dashboard statistics and bookings
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      setDashboardError("");
      setBookingsError("");

      const results = await Promise.allSettled([
        apiRequest("/reports/dashboard/"),
        apiRequest("/bookings/"),
      ]);

      if (!isMounted) return;

      if (results[0].status === "fulfilled") {
        setDashboardData(results[0].value);
      } else {
        setDashboardError(results[0].reason.message);
      }

      if (results[1].status === "fulfilled") {
        const bookingData = results[1].value;

        const bookingList = Array.isArray(bookingData)
          ? bookingData
          : bookingData.results || bookingData.bookings || [];

        setBookings(bookingList);
      } else {
        setBookingsError(results[1].reason.message);
      }

      setLoading(false);
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Fetch all rooms from Django
  const fetchRooms = async () => {
    setRoomsLoading(true);
    setRoomsError("");


    try {
      const data = await apiRequest("/rooms/");

      const roomList = Array.isArray(data)
        ? data
        : data.results || data.rooms || [];

      setRooms(roomList);
    } catch (error) {
      setRoomsError(error.message);
    } finally {
      setRoomsLoading(false);
    }
  };

  const fetchCustomers = async () => {
  setCustomersLoading(true);
  setCustomersError("");

  try {
    const data = await apiRequest("/customers/");

    const customerList = Array.isArray(data)
      ? data
      : data.results || data.customers || [];

    setCustomers(customerList);
  } catch (error) {
    setCustomersError(error.message);
  } finally {
    setCustomersLoading(false);
  }
};

const fetchPayments = async () => {
  setPaymentsLoading(true);
  setPaymentsError("");

  try {
    const data = await apiRequest("/payments/");

    const paymentList = Array.isArray(data)
      ? data
      : data.results || data.payments || [];

    setPayments(paymentList);
  } catch (error) {
    setPaymentsError(error.message);
  } finally {
    setPaymentsLoading(false);
  }
};

const fetchEmployees = async () => {
  setEmployeesLoading(true);
  setEmployeesError("");

  try {
    const data = await apiRequest("/employees/");

    const employeeList = Array.isArray(data)
      ? data
      : data.results || data.employees || [];

    setEmployees(employeeList);
  } catch (error) {
    setEmployeesError(error.message);
  } finally {
    setEmployeesLoading(false);
  }
};

const fetchReportData = async () => {
  setReportLoading(true);
  setDashboardError("");

  try {
    const data = await apiRequest("/reports/dashboard/");
    setDashboardData(data);
  } catch (error) {
    setDashboardError(error.message);
  } finally {
    setReportLoading(false);
  }
};

const openAddEmployeeForm = () => {
  setEmployeeForm(emptyEmployeeForm);
  setEmployeeMessage("");
  setEmployeesError("");
  setShowEmployeeForm(true);
};

const handleEmployeeFormChange = (e) => {
  const { name, value } = e.target;

  setEmployeeForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const handleEmployeeSubmit = async (e) => {
  e.preventDefault();

  setSavingEmployee(true);
  setEmployeesError("");
  setEmployeeMessage("");

  try {
    await apiRequest("/employees/", {
      method: "POST",
      body: JSON.stringify({
        ...employeeForm,
        salary: Number(employeeForm.salary),
      }),
    });

    setEmployeeMessage("Employee added successfully!");
    setEmployeeForm(emptyEmployeeForm);
    setShowEmployeeForm(false);

    await fetchEmployees();
  } catch (error) {
    setEmployeesError(error.message);
  } finally {
    setSavingEmployee(false);
  }
};

useEffect(() => {
  if (user && selectedPage === "Reports") {
    fetchReportData();
  }
}, [user, selectedPage]);

useEffect(() => {
  if (user && selectedPage === "Employees") {
    fetchEmployees();
  }
}, [user, selectedPage]);

useEffect(() => {
  if (user && selectedPage === "Payments") {
    fetchPayments();
  }
}, [user, selectedPage]);

useEffect(() => {
  if (user && selectedPage === "Customers") {
    fetchCustomers();
  }
}, [user, selectedPage]);


  
  // Automatically load rooms when Rooms page opens
  useEffect(() => {
    if (user && selectedPage === "Rooms") {
      fetchRooms();
    }
  }, [user, selectedPage]);

 useEffect(() => {
  sessionStorage.setItem("hotel_selected_page", selectedPage);
}, [selectedPage]);



// Open form to add a room
const openAddRoomForm = () => {
  setEditingRoom(null);
  setRoomForm(emptyRoomForm);
  setRoomMessage("");
  setShowRoomForm(true);
};

// Open form to edit a room
const openEditRoomForm = (room) => {
  setEditingRoom(room);

  setRoomForm({
    room_number: room.room_number || "",
    room_type: room.room_type || "SINGLE",
    description: room.description || "",
    price_per_night: room.price_per_night || "",
    capacity: String(room.capacity || 1),
    amenities: room.amenities || "",
    status: room.status || "AVAILABLE",
  });

  setRoomMessage("");
  setShowRoomForm(true);
};

// Handle changes in the room form
const handleRoomFormChange = (event) => {
  const { name, value } = event.target;

  setRoomForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};

// Add or update a room
const handleRoomSubmit = async (event) => {
  event.preventDefault();

  setSavingRoom(true);
  setRoomMessage("");
  setRoomsError("");

  const roomData = {
    ...roomForm,
    price_per_night: Number(roomForm.price_per_night),
    capacity: Number(roomForm.capacity),
  };

  try {
    if (editingRoom) {
      await apiRequest(`/rooms/${editingRoom.id}/`, {
        method: "PATCH",
        body: JSON.stringify(roomData),
      });

      setRoomMessage("Room updated successfully.");
    } else {
      await apiRequest("/rooms/", {
        method: "POST",
        body: JSON.stringify(roomData),
      });

      setRoomMessage("Room added successfully.");
    }

    setShowRoomForm(false);
    setEditingRoom(null);
    setRoomForm(emptyRoomForm);

    await fetchRooms();
  } catch (error) {
    setRoomMessage(error.message);
  } finally {
    setSavingRoom(false);
  }
};

// Delete a room
const handleDeleteRoom = async (room) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete room ${room.room_number}?`
  );

  if (!confirmed) return;

  setRoomMessage("");

  try {
    await apiRequest(`/rooms/${room.id}/`, {
      method: "DELETE",
    });

    setRoomMessage("Room deleted successfully.");

    await fetchRooms();
  } catch (error) {
    setRoomMessage(error.message);
  }
};


  // Handle user logout
  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await apiRequest("/accounts/logout/", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      sessionStorage.removeItem("hotel_token");
      sessionStorage.removeItem("hotel_user");
      sessionStorage.removeItem("hotel_selected_page");
      setSelectedPage("Dashboard");

      setUser(null);
      setLoggingOut(false);
    }
  };

  // Show login page if nobody is logged in
  if (!user) {
    return <Login onLogin={setUser} />;
  }
  
  // Format currency
  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Dashboard statistics
  const stats = [
    {
      title: "Total Rooms",
      value: dashboardData?.total_rooms ?? 0,
      change: "Registered hotel rooms",
      icon: BedDouble,
      color: "blue",
    },
    {
      title: "Total Bookings",
      value: dashboardData?.total_bookings ?? 0,
      change: "All reservations",
      icon: CalendarDays,
      color: "purple",
    },
    {
      title: "Customers",
      value: dashboardData?.total_customers ?? 0,
      change: "Registered customers",
      icon: Users,
      color: "green",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardData?.total_revenue),
      change: "Completed payments",
      icon: CreditCard,
      color: "orange",
    },
  ];

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Rooms", icon: BedDouble },
    { name: "Bookings", icon: CalendarDays },
    { name: "Customers", icon: Users },
    { name: "Payments", icon: CreditCard },
    { name: "Employees", icon: UserCog },
    { name: "Reports", icon: BarChart3 },
  ];

  const availableRooms = dashboardData?.available_rooms ?? 0;
  const totalRooms = dashboardData?.total_rooms ?? 0;
  const maintenanceRooms = Math.max(totalRooms - availableRooms, 0);

  const availablePercentage =
    totalRooms > 0 ? (availableRooms / totalRooms) * 100 : 0;

  const maintenancePercentage =
    totalRooms > 0 ? (maintenanceRooms / totalRooms) * 100 : 0;

  // Get a readable customer label
  const getCustomerName = (customer) => {
    if (!customer) return "Unknown Customer";

    if (typeof customer === "object") {
      return (
        customer.username ||
        customer.full_name ||
        customer.name ||
        `Customer #${customer.id || ""}`
      );
    }

    return `Customer #${customer}`;
  };

  // Get a readable room label
  const getRoomName = (room) => {
    if (!room) return "Unknown Room";

    if (typeof room === "object") {
      return room.room_number
        ? `Room ${room.room_number}`
        : `Room #${room.id || ""}`;
    }

    return `Room #${room}`;
  };

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (selectedPage !== "Dashboard") {
  return (
    <div className="dashboard">
      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{selectedPage}</h1>
            <p>GrandStay Hotel Management System</p>
          </div>

          <button
            className="view-button"
            onClick={() => setSelectedPage("Dashboard")}
          >
            Back to Dashboard
          </button>
        </header>
        {selectedPage === "Bookings" ? (
  <div className="page-content">
    <h2>All Bookings</h2>

    {<div className="page-content">
  <div className="page-heading">
    <div>
      <h2>All Bookings</h2>
      <p>View and manage hotel reservations.</p>
    </div>
  </div>

  {bookingsError && (
    <p className="error-message">{bookingsError}</p>
  )}

  {bookings.length === 0 ? (
    <p>No bookings found.</p>
  ) : (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Room</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Guests</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>#{booking.id}</td>
              <td>{getCustomerName(booking)}</td>
              <td>{getRoomName(booking)}</td>
              <td>{booking.check_in}</td>
              <td>{booking.check_out}</td>
              <td>{booking.number_of_guests}</td>
              <td>
                RWF {Number(booking.total_price).toLocaleString()}
              </td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>}
  </div>
) : selectedPage === "Rooms" ? (
  <div className="page-content">
    <div className="page-heading">
      <div>
        <h2>Room Management</h2>
        <p>Manage your hotel's rooms and availability.</p>
      </div>

      <button onClick={openAddRoomForm}>
        + Add Room
      </button>
    </div>

    {roomsLoading && <p>Loading rooms...</p>}

    {roomsError && (
      <p className="error-message">{roomsError}</p>
    )}

    {roomMessage && (
      <p className="success-message">{roomMessage}</p>
    )}

    {!roomsLoading && !roomsError && rooms.length === 0 && (
      <p>No rooms found. Add your first room.</p>
    )}

    {rooms.length > 0 && (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Room Type</th>
              <th>Price / Night</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.room_number}</td>
                <td>{room.room_type}</td>
                <td>RWF {Number(room.price_per_night).toLocaleString()}</td>
                <td>{room.capacity}</td>
                <td>{room.status}</td>
                <td>
                  <button onClick={() => openEditRoomForm(room)}>
                    Edit
                  </button>

                  <button onClick={() => handleDeleteRoom(room.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {showRoomForm && (
      <form onSubmit={handleRoomSubmit} className="room-form">
        <h3>{editingRoom ? "Edit Room" : "Add New Room"}</h3>

        <label>Room Number</label>
        <input
          name="room_number"
          value={roomForm.room_number}
          onChange={handleRoomFormChange}
          required
        />

        <label>Room Type</label>
        <select
          name="room_type"
          value={roomForm.room_type}
          onChange={handleRoomFormChange}
        >
          <option value="SINGLE">Single</option>
          <option value="DOUBLE">Double</option>
          <option value="DELUXE">Deluxe</option>
          <option value="SUITE">Suite</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          value={roomForm.description}
          onChange={handleRoomFormChange}
        />

        <label>Price Per Night (RWF)</label>
        <input
          type="number"
          name="price_per_night"
          value={roomForm.price_per_night}
          onChange={handleRoomFormChange}
          min="0"
          required
        />

        <label>Capacity</label>
        <input
          type="number"
          name="capacity"
          value={roomForm.capacity}
          onChange={handleRoomFormChange}
          min="1"
          required
        />

        <label>Amenities</label>
        <input
          name="amenities"
          value={roomForm.amenities}
          onChange={handleRoomFormChange}
        />

        <label>Status</label>
        <select
          name="status"
          value={roomForm.status}
          onChange={handleRoomFormChange}
        >
          <option value="AVAILABLE">Available</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>

        <button type="submit" disabled={savingRoom}>
          {savingRoom
            ? "Saving..."
            : editingRoom
              ? "Update Room"
              : "Save Room"}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowRoomForm(false);
            setEditingRoom(null);
            setRoomForm(emptyRoomForm);
          }}
        >
          Cancel
        </button>
      </form>
    )}
  </div>
) : selectedPage === "Customers" ? (
  <div className="page-content">
    <div className="page-heading">
      <div>
        <h2>Customer Management</h2>
        <p>View and manage registered hotel customers.</p>
      </div>
    </div>

    <input
      type="text"
      placeholder="Search customers by name or email..."
      value={customerSearch}
      onChange={(e) => setCustomerSearch(e.target.value)}
      className="customer-search"
    />

    {customersLoading && <p>Loading customers...</p>}

    {customersError && (
      <p className="error-message">{customersError}</p>
    )}

    {!customersLoading && !customersError && customers.length === 0 && (
      <p>No customers found.</p>
    )}

    {!customersLoading && customers.length > 0 && (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Date of Birth</th>
            </tr>
          </thead>

          <tbody>
            {customers
              .filter((customer) => {
                const userDetails = customer.user || {};

                const name =
                  customer.full_name ||
                  customer.username ||
                  userDetails.username ||
                  "";

                const email =
                  customer.email ||
                  userDetails.email ||
                  "";

                const search = customerSearch.toLowerCase();

                return (
                  name.toLowerCase().includes(search) ||
                  email.toLowerCase().includes(search)
                );
              })
              .map((customer) => {
                const userDetails = customer.user || {};

                return (
                  <tr key={customer.id}>
                    <td>
                      {customer.full_name ||
                        customer.username ||
                        userDetails.username ||
                        "N/A"}
                    </td>

                    <td>
                      {customer.email ||
                        userDetails.email ||
                        "N/A"}
                    </td>

                    <td>
                      {customer.phone ||
                        userDetails.phone ||
                        "N/A"}
                    </td>

                    <td>{customer.address || "N/A"}</td>

                    <td>
                      {customer.date_of_birth ||
                        customer.dob ||
                        "N/A"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    )}
  </div>) : selectedPage === "Employees" ? (
  <div className="page-content">
    <div className="page-heading">
      <div>
        <h2>Employee Management</h2>
        <p>View and manage your hotel staff.</p>
      </div>

       <button onClick={openAddEmployeeForm}>
        + Add Employee
      </button>
      {employeeMessage && (
  <p className="success-message">{employeeMessage}</p>
)}

{showEmployeeForm && (
  <form onSubmit={handleEmployeeSubmit} className="employee-form">
    <h3>Add New Employee</h3>

    <label>Full Name</label>
    <input
      name="full_name"
      value={employeeForm.full_name}
      onChange={handleEmployeeFormChange}
      placeholder="Enter full name"
      required
    />

    <label>Email Address</label>
    <input
      type="email"
      name="email"
      value={employeeForm.email}
      onChange={handleEmployeeFormChange}
      placeholder="Enter email address"
      required
    />

    <label>Phone Number</label>
    <input
      name="phone"
      value={employeeForm.phone}
      onChange={handleEmployeeFormChange}
      placeholder="Enter phone number"
    />

    <label>Position</label>
    <input
      name="position"
      value={employeeForm.position}
      onChange={handleEmployeeFormChange}
      placeholder="e.g. Receptionist"
      required
    />

    <label>Salary (RWF)</label>
    <input
      type="number"
      name="salary"
      value={employeeForm.salary}
      onChange={handleEmployeeFormChange}
      min="0"
      step="0.01"
      placeholder="Enter salary"
      required
    />

    <label>Hire Date</label>
    <input
      type="date"
      name="hire_date"
      value={employeeForm.hire_date}
      onChange={handleEmployeeFormChange}
      required
    />

    <label>Employment Status</label>
    <select
      name="employment_status"
      value={employeeForm.employment_status}
      onChange={handleEmployeeFormChange}
    >
      <option value="ACTIVE">Active</option>
      <option value="INACTIVE">Inactive</option>
      <option value="ON_LEAVE">On Leave</option>
    </select>

    <label>Address</label>
    <textarea
      name="address"
      value={employeeForm.address}
      onChange={handleEmployeeFormChange}
      placeholder="Enter employee address"
    />

    <div className="employee-form-actions">
      <button type="submit" disabled={savingEmployee}>
        {savingEmployee ? "Saving..." : "Save Employee"}
      </button>

      <button
        type="button"
        onClick={() => {
          setShowEmployeeForm(false);
          setEmployeeForm(emptyEmployeeForm);
        }}
      >
        Cancel
      </button>
    </div>
  </form>
)}

    </div>

    <input
      type="text"
      placeholder="Search by name, email or position..."
      value={employeeSearch}
      onChange={(e) => setEmployeeSearch(e.target.value)}
      className="customer-search"
    />

    {employeesLoading && <p>Loading employees...</p>}

    {employeesError && (
      <p className="error-message">{employeesError}</p>
    )}

    {!employeesLoading && !employeesError && employees.length === 0 && (
      <p>No employees found.</p>
    )}

    {!employeesLoading && employees.length > 0 && (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Hire Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {employees
              .filter((employee) => {
                const search = employeeSearch.toLowerCase();

                return (
                  (employee.full_name || "").toLowerCase().includes(search) ||
                  (employee.email || "").toLowerCase().includes(search) ||
                  (employee.position || "").toLowerCase().includes(search)
                );
              })
              .map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.full_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone || "N/A"}</td>
                  <td>{employee.position}</td>
                  <td>
                    RWF {Number(employee.salary).toLocaleString()}
                  </td>
                  <td>{employee.hire_date || "N/A"}</td>
                  <td>
                    <span
                      className={`employee-status ${
                        (employee.employment_status || "").toLowerCase()
                      }`}
                    >
                      {employee.employment_status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )}
  </div>) : selectedPage === "Payments" ? (
  <div className="page-content">
    <div className="page-heading">
      <div>
        <h2>Payments Management</h2>
        <p>View and monitor hotel payment transactions.</p>
      </div>
    </div>

    <input
      type="text"
      placeholder="Search by transaction reference..."
      value={paymentSearch}
      onChange={(e) => setPaymentSearch(e.target.value)}
      className="customer-search"
    />

    {paymentsLoading && <p>Loading payments...</p>}

    {paymentsError && (
      <p className="error-message">{paymentsError}</p>
    )}

    {!paymentsLoading && !paymentsError && payments.length === 0 && (
      <p>No payment records found.</p>
    )}

    {!paymentsLoading && payments.length > 0 && (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Booking ID</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Transaction Reference</th>
              <th>Payment Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {payments
              .filter((payment) =>
                (payment.transaction_reference || "")
                  .toLowerCase()
                  .includes(paymentSearch.toLowerCase())
              )
              .map((payment) => (
                <tr key={payment.id}>
                  <td>#{payment.id}</td>

                  <td>
                    #{typeof payment.booking === "object"
                      ? payment.booking?.id
                      : payment.booking}
                  </td>

                  <td>
                    RWF {Number(payment.amount).toLocaleString()}
                  </td>

                  <td>{payment.method}</td>

                  <td>
                    {payment.transaction_reference || "N/A"}
                  </td>

                  <td>
                    {payment.payment_date
                      ? new Date(payment.payment_date).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    <span className={`payment-status ${(
                      payment.status || ""
                    ).toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )}
  </div>): selectedPage === "Reports" ? (
  <div className="page-content">
    <div className="page-heading">
      <div>
        <h2>Hotel Reports</h2>
        <p>Overview of your hotel's performance and operations.</p>
      </div>

      <button onClick={fetchReportData} disabled={reportLoading}>
        {reportLoading ? "Refreshing..." : "Refresh Reports"}
      </button>
    </div>

    {reportLoading && <p>Loading reports...</p>}

    {dashboardError && (
      <p className="error-message">{dashboardError}</p>
    )}

    {dashboardData && !reportLoading && (
      <>
        <div className="report-grid">
          <div className="stat-card">
            <p>Total Customers</p>
            <h2>{dashboardData.total_customers}</h2>
          </div>

          <div className="stat-card">
            <p>Total Employees</p>
            <h2>{dashboardData.total_employees}</h2>
          </div>

          <div className="stat-card">
            <p>Total Rooms</p>
            <h2>{dashboardData.total_rooms}</h2>
          </div>

          <div className="stat-card">
            <p>Available Rooms</p>
            <h2>{dashboardData.available_rooms}</h2>
          </div>

          <div className="stat-card">
            <p>Total Bookings</p>
            <h2>{dashboardData.total_bookings}</h2>
          </div>

          <div className="stat-card">
            <p>Pending Bookings</p>
            <h2>{dashboardData.pending_bookings}</h2>
          </div>

          <div className="stat-card">
            <p>Confirmed Bookings</p>
            <h2>{dashboardData.confirmed_bookings}</h2>
          </div>

          <div className="stat-card">
            <p>Cancelled Bookings</p>
            <h2>{dashboardData.cancelled_bookings}</h2>
          </div>

          <div className="stat-card">
            <p>Total Payments</p>
            <h2>{dashboardData.total_payments}</h2>
          </div>

          <div className="stat-card">
            <p>Completed Payments</p>
            <h2>{dashboardData.completed_payments}</h2>
          </div>

          <div className="stat-card">
            <p>Total Revenue</p>
            <h2>
              RWF {Number(dashboardData.total_revenue).toLocaleString()}
            </h2>
          </div>
        </div>
      </>
    )}
  </div>): (
  <div className="page-content">
    <h2>{selectedPage}</h2>
    <p>This section is coming soon.</p>
  </div>
)}

      </main>
    </div>
  );
}
  return (
    // Display other pages when selected

    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <BedDouble size={25} />
          </div>

          <div>
            <h2>GrandStay</h2>
            <span>Hotel Management</span>
          </div>
        </div>

        <div className="menu-heading">MAIN MENU</div>

        <nav>
          {navigation.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.name}
                onClick={() => setSelectedPage(item.name)}
                className={
                  selectedPage === item.name
                    ? "nav-link active"
                    : "nav-link"
                }
             >
               <Icon size={19} />
               <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <a href="#" className="nav-link">
            <Settings size={19} />
            <span>Settings</span>
          </a>

          <button
            type="button"
            className="nav-link logout-button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut size={19} />
            <span>{loggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>
              Welcome back! Here's what's happening at your hotel.
            </p>
          </div>

          <div className="topbar-actions">
            <button className="icon-button">
              <Search size={20} />
            </button>

            <button className="icon-button">
              <Bell size={20} />
            </button>

            <div className="profile">
              <div className="avatar">
                {user.username?.charAt(0).toUpperCase() || "A"}
              </div>

              <div>
                <strong>{user.username || "Administrator"}</strong>
                <span>{user.role || "Hotel Admin"}</span>
              </div>
            </div>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <h2>Hotel Overview</h2>
            <p>
              Monitor your hotel performance and daily activities.
            </p>
          </div>

          <button className="date-button">
            <CalendarDays size={17} />
            {currentMonth}
          </button>
        </section>

        {dashboardError && (
          <p className="error-message">
            Could not load dashboard statistics: {dashboardError}
          </p>
        )}

        <section className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div className="stat-card" key={stat.title}>
                <div className={`stat-icon ${stat.color}`}>
                  <Icon size={23} />
                </div>

                <p>{stat.title}</p>

                <h2>
                  {stat.title === "Total Revenue" ? "RWF " : ""}
                  {loading ? "..." : stat.value}
                </h2>

                <span>{stat.change}</span>
              </div>
            );
          })}
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Recent Bookings</h3>
                <p>Latest hotel reservations</p>
              </div>

              <button className="view-button"
  onClick={() => setSelectedPage("Bookings")}
>
  View all <ArrowUpRight size={16} />
              </button>
            </div>

            {bookingsError && (
              <p className="error-message">
                Could not load bookings: {bookingsError}
              </p>
            )}

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Room</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4">Loading bookings...</td>
                    </tr>
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td colSpan="4">No bookings found.</td>
                    </tr>
                  ) : (
                    bookings.slice(0, 5).map((booking) => {
                      const status = (
                        booking.status || "PENDING"
                      ).toLowerCase();

                      return (
                        <tr key={booking.id}>
                          <td>#{booking.id}</td>
                          <td>{getCustomerName(booking.customer)}</td>
                          <td>{getRoomName(booking.room)}</td>
                          <td>
                            <span className={`status ${status}`}>
                              {status === "confirmed" ? (
                                <CheckCircle size={13} />
                              ) : (
                                <Clock size={13} />
                              )}
                              {booking.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Room Availability</h3>
                <p>Current room status</p>
              </div>
            </div>

            <div className="availability-item">
              <div className="availability-label">
                <span>Available Rooms</span>
                <strong>{loading ? "..." : availableRooms}</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-fill available-fill"
                  style={{ width: `${availablePercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="availability-item">
              <div className="availability-label">
                <span>Under Maintenance</span>
                <strong>{loading ? "..." : maintenanceRooms}</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-fill maintenance-fill"
                  style={{ width: `${maintenancePercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="availability-note">
              <CheckCircle size={17} />
              {loading
                ? "Loading room availability..."
                : maintenanceRooms === 0
                  ? "All registered rooms are currently available."
                  : `${maintenanceRooms} room(s) currently under maintenance.`}
            </div>
          </div>
        </section>

        <footer className="footer">
          © 2026 GrandStay Hotel Management System.
          All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default App;

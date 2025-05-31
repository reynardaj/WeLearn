import PaymentButton from "../../components/PaymentButton";

export default function PaymentPage() {
  return (
    <div>
      <h1>Payment Page</h1>
      <PaymentButton amount={50000} description="Test Payment" />
    </div>
  );
}

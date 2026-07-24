export default function Pricing() {
  const tiers = [
    { name: "Starter", priceId: "price_starter", amount: "$9/mo" },
    { name: "Pro", priceId: "price_pro", amount: "$29/mo" },
    { name: "Enterprise", priceId: "price_enterprise", amount: "$99/mo" },
  ];

  return (
    <div>
      <h1>Choose your plan</h1>
      {tiers.map(t => (
        <form key={t.priceId} action="/api/create-checkout-session" method="POST">
          <h2>{t.name}</h2>
          <p>{t.amount}</p>
          <input type="hidden" name="priceId" value={t.priceId} />
          <button type="submit">Subscribe</button>
        </form>
      ))}
    </div>
  );
}

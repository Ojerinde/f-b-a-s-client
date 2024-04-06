import Image from "next/image";

const Navigation = () => {
  return (
    <nav className="navigation">
      <figure style={{ borderRadius: "20%", overflow: "hidden" }}>
        <Image
          src="/images/F-B-A-S.png"
          alt="Logo"
          width={100}
          height={80}
          style={{ objectFit: "cover" }}
        />
      </figure>

      <div>
        <p>Device Power Level: </p>
      </div>
    </nav>
  );
};
export default Navigation;

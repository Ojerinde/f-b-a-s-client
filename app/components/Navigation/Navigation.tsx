import Image from "next/image";
import { useRouter } from "next/navigation";

const Navigation = () => {
  const router = useRouter();
  return (
    <nav className="navigation">
      <figure
        style={{ borderRadius: "20%", overflow: "hidden" }}
        onClick={() => router.push("/")}
      >
        <Image
          src="/images/F-B-A-S.png"
          alt="Logo"
          width={100}
          height={80}
          style={{ objectFit: "cover" }}
        />
      </figure>

      <div>
        <h2>Device Power Level: </h2>
      </div>
    </nav>
  );
};
export default Navigation;

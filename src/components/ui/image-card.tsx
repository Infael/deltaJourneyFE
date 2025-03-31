type Props = {
  imageUrl: string;
  caption?: string;
};

export default function ImageCard({ imageUrl, caption }: Props) {
  return (
    <figure className="rounded-base border-border bg-main font-base shadow-shadow w-[250px] overflow-hidden border-2">
      <img className="aspect-[4/3] w-full" src={imageUrl} alt="" />
      {caption && <figcaption className="text-mtext border-border border-t-2 p-4">{caption}</figcaption>}
    </figure>
  );
}

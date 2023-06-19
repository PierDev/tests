import { clients } from './config';
import { createConstellation } from './factory';

async function  main() {
  const constellation = await createConstellation (
    clients,
    "Test token",
    "TST",
    [100, 250],
    false,
    true
  );

  console.log(constellation);

  
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
  
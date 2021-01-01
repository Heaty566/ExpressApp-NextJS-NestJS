import { Resolver, Query } from '@nestjs/graphql';

@Resolver(of => Boolean)
export class FakeResolver {
        @Query(returns => Boolean)
        async test() {
                return true;
        }
}
